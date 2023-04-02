---
title: "Render Text with SDL"
date: 2020-11-28
tags:
- sdl
- c
- gamedev
---
A few months ago, I created a system to load a series of bytes and transform
then into a SDL texture that could then be clipped and rendered as individual
characters on the screen. On this post, I'll go through how I used that
system to display a series of characters on a given screen position with one
function call. [Here is the last post](/posts/2020/08/12/custom-font-texture-loader-with-sdl/).

Before getting into all that, I refactored the `bits_to_pixels` and
`data_to_texture` functions to be more flexible.

```c
void bits_to_pixels(
	uint32_t* pixels,
	const char* bits,
	uint32_t bytes_per_row,
	uint32_t row_count,
	uint8_t r, uint8_t g, uint8_t b)
{
    const size_t BITS_IN_BYTE = 8;

    uint32_t target_color =
		(r << 3 * BITS_IN_BYTE) |
		(g << 2 * BITS_IN_BYTE) |
		(b << 1 * BITS_IN_BYTE);

	for (int row = 0; row < row_count; row++)
	{
		for (int col = 0; col < BITS_IN_BYTE * bytes_per_row ; col++)
		{
			int bit_col = col % BITS_IN_BYTE;
			int current_byte = (row * bytes_per_row) + (col / BITS_IN_BYTE);

			uint32_t pixel = 0;

			if ((bits[current_byte] & (1 << (BITS_IN_BYTE - 1 - bit_col))) > 0)
			{
				pixel = target_color | 0xFF;
			}

			pixels[col + row * BITS_IN_BYTE * bytes_per_row] = pixel;

			printf("%c", pixel > 0 ? '0' : '.');
		}
		printf("\n");
	}
}

SDL_Texture* data_to_texture(
    SDL_Renderer* rend,
    const char** data,
    uint32_t bytes_per_row,
    uint32_t row_count,
    uint32_t elem_count,
    uint8_t r, uint8_t g, uint8_t b)
{
    uint32_t col_count = bytes_per_row * 8;

    Uint32 rmask, gmask, bmask, amask;
#if SDL_BYTEORDER == SDL_BIG_ENDIAN
    rmask = 0xff000000;
    gmask = 0x00ff0000;
    bmask = 0x0000ff00;
    amask = 0x000000ff;
#else
    rmask = 0x000000ff;
    gmask = 0x0000ff00;
    bmask = 0x00ff0000;
    amask = 0xff000000;
#endif

    uint32_t* pixel_data = (uint32_t*)malloc(sizeof(*pixel_data) * col_count * row_count * elem_count);

    for (int i = 0; i < elem_count; i++)
    {
        uint32_t elem = i * col_count * row_count;
        bits_to_pixels(&pixel_data[elem], &data[i], bytes_per_row, row_count, r, g, b);
    }
    // creating a vertical strip surface of the elements
    // pixel_data holds each row of a character continuously, so vstrip is easier to load
    SDL_Surface* surf = SDL_CreateRGBSurfaceFrom(
        (void*)pixel_data,               // 0xRRGGBBAA for each pixel
        col_count,                       // width
        row_count * elem_count,          // height
        32,                              // depth
        col_count * sizeof(*pixel_data), // pitch (length of a row of pixels in bytes)
        rmask, gmask, bmask, amask);     // color mask

    SDL_Texture* tex = SDL_CreateTextureFromSurface(rend, surf);

    SDL_FreeSurface(surf);
    free(pixel_data);

    return tex;
}
```

This change allows for the width of the final texture to be a multiple of 8
and the height to be any size. Each unit of the `bytes_per_row` parameter
is eight pixel columns (as a byte has 8 bits). The `row_count` turns into the
pixel height of each character. The `elem_count` is the number of characters
that is passed in the `data`.

Even though the functions allow for a different width and height, I'll stick
with the 8 x 8 setup as before. With that, I expanded the character set that
had only two letters. I considered that the character set should be the data
for the `printable` ASCII characters, the first element being the space character,
which has a decimal ASCII value of 32. So when I get a C string to render, I would
only need to subtract 32 from each character to get its offset in the texture.

Because there are a lot of variables to keep track of for a particular font,
I created this `font_t` type that contains information about the character
set, as well as the SDL renderer, its texture, and a desired scale.

```c
typedef struct font_t {
    uint32_t length;
    uint32_t bytes_per_row;
    uint32_t rows_per_character;
    uint32_t scale;
    SDL_Renderer* rend;
    SDL_Texture* tex;
    char* data;
} font_t;
```

Just to make the font creation and cleanup a little nicer, these functions
will take care of what needs to be done. Since the font "owns" the texture,
it should be the one who cleans it up, but the other pointers were passed in.

```c
void font_create(
    font_t* out,
    SDL_Renderer* rend,
    const char** data,
    uint32_t bytes_per_row,
    uint32_t rows_per_character,
    uint32_t length) {

    out->length = length;
    out->bytes_per_row = bytes_per_row;
    out->rows_per_character = rows_per_character;
    out->data = data;
    out->scale = 1;
    out->rend = rend;
    out->tex = data_to_texture(rend, data, bytes_per_row, rows_per_character, length, 0xFF, 0xFF, 0xFF);
}

void font_destroy(font_t* font)
{
    SDL_DestroyTexture(font->tex);
}
```

So now a font can be created and destroyed.

```c
font_t font88;
font_create(&font88, rend, FONT_8X8_BASIC, 1, 8, FONT_8X8_BASIC_LENGTH);
font88.scale = 2;

// ...

font_destroy(&font88);
```

The font is ready to be used now. As I stated earlier, I want to be able to
make a single function call to render any given text. The following function
uses a font to render the C string `str` at the `x`, `y` position.

```c
const FONT_PRINTABLE_START = 32;

void draw_text(font_t* font, const char* str, int32_t x, int32_t y)
{
    int w = font->bytes_per_row * 8;
    int h = font->rows_per_character;
    int scale = font->scale;

    // change y to get a different character from the texture
    SDL_Rect sr = { 0, 0, w, h };

    // change x to render a char next to another on the screen
    SDL_Rect dr = { x, y, w * scale, h * scale };

    size_t len = strlen(str);
    for (size_t i = 0; i < len; i++) {
        char c = str[i];
        int offset = c - FONT_PRINTABLE_START;
        sr.y = h * offset;
        dr.x = x + i * w * scale;
        SDL_RenderCopy(font->rend, font->tex, &sr, &dr);
    }
}
```

Using the function is really simple:

```c
draw_text(&font88, "HELLO WORLD!", 30, 30);
```

The result:

![hello world](/assets/images/sdl-custom-font-03.jpg)

I uploaded the code to [GitHub](https://github.com/blotta/blt_sdl_utils), if
you're interested in how it's all put together.