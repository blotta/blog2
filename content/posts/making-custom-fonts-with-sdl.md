---
title: "Making Custom Fonts With SDL"
date: 2020-08-05
tags:
- sdl
- c
- gamedev
---

I've been playing around with making custom glyphs that would be translated
into a SDL texture. I wanted to start out by taking an array of 8 bytes for
each character and creating a 8x8 texture. Each bit in a byte determines if
the pixel is fully transparent or fully colored.

Here's how I represented a single `A` character:

```c
char font8x8[1][8] =
{
	{
		0b00111000,  
		0b01111100,  
		0b01101100,  
		0b11000110,  
		0b11000110,  
		0b11111110,  
		0b11000110,  
		0b00000000,  
	}
}
```

Each bit represents a pixel, and a RGBA pixel has 4 bytes that can be
represented with `0xRRGGBBAA`. The following function does that conversion:

```c
void bitsToPixels(
    uint32_t* pixels,
    const char* bits,
    size_t size,
    uint8_t r, uint8_t g, uint8_t b)
{
    uint32_t r32 = r;
    uint32_t g32 = g;
    uint32_t b32 = b;
    uint32_t target_color =
        (r32 << 3 * 8) |
        (g32 << 2 * 8) |
        (b32 << 1 * 8);

    for (int row = 0; row < size; row++)
    {
        for (int col = 0; col < size; col++)
        {
            uint32_t a32 =
                ( bits[row] & (1 << (size - 1 - col)) ) > 0 ? 0xFF : 0x00;

            uint32_t pixel = 0x00000000;
            if (a32 > 0)
            {
                pixel = target_color | a32;
            }

            pixels[col + row * size] = pixel;
        }
    }
}
```

The function takes in an address to store the pixels and the bytes to read
from. It assumes that the width is the same as height, represented by `size`.
A single color is set on the fully colored pixels.

The variable `target_color` will hold a byte with the format `0xRRGGBB00`.

Iterating over each bit, we check if it is on or off by shifting a `1` into
the bit column and masking it against the current byte. If it is on, the
alpha value is set to `0xFF`, `0x00` otherwise.

If the alpha is greater than `0`, we combine it with the `target_color` and
set it into the corresponding `pixels` address.

Here the data is generated with a white pixel color:

```c
const SIZE = 8;
uint32_t* char_a_data = malloc(sizeof(*char_a_data) * SIZE * SIZE);
bitsToPixels(char_a_data, font8x8[0], SIZE, 0xFF, 0xFF, 0xFF);
```

Now that the pixel data is ready, we can create a SDL surface that can later
on be used to create a SDL texture.

```c
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

SDL_Surface* char_a_surf = SDL_CreateRGBSurfaceFrom(
    (void*)char_a_data,          // pixel data
    SIZE, SIZE,                  // width, height
    32,                          // depth (bits per pixel)
    SIZE * 4,                    // pitch (pixels per row in bytes)
    rmask, gmask, bmask, amask); // RGBA mask

SDL_Texture* char_a_tex =
    SDL_CreateTextureFromSurface(renderer, char_a_surf);

SDL_FreeSurface(char_a_surf);
free(char_a_data);
```

The pixel data is now on the GPU as a texture, so the surface and the
original data can be freed. If the surface was to be used later on, then the
pixel data cannot be freed, since it is being referenced by the surface.

The texture can now be drawn and stretched, giving it a retro look!

```c
// Draw awesome custom font made from bits
SDL_Rect char_rect = { 100, 100, 32, 32 };
SDL_RenderCopy(renderer, char_a_tex, NULL, &char_rect);
```

![win](/assets/images/sdl-custom-font-01.png)

All this can also be applied for creating sprites and tilemaps at runtime
with just a few tweaks.

If you don't want to design all the characters, someone has already done
that. Check it out
[here](https://github.com/dhepper/font8x8/blob/master/font8x8_basic.h). Each
character can be indexed with the actual character, e.g.
`font8x8_basic['A']`.

This was all a quick and dirty solution to the problem, but it would be very
inefficient to create a texture for each character. A better strategy would
be to load all the characters as a single surface, use that to generate the
texture, and index the position of each character within the texture in
`SDL_RenderCopy()`. That's what I'll be looking at next.
