---
title: "Maintain aspect ratio for any window size"
subtitle: "Fitting a viewports into windows without distortion"
date: 2021-06-13
tags:
- gamedev
- sfml
- cpp
---

All the viewport resizing is usually done for you automatically, when using a
game engine. Since I've been playing around with SFML and how to implement a
simple 2D camera system, I found myself in need of a solution to keep the aspect
ratio of a game for any window size.

SFML has the `sf::View` class which can be used as a camera. It can be resized
and positioned. To draw from the perspective of a camera in a window (i.e
`sf::RenderWindow`), we set the view of the window before drawing. If not set,
drawables will be drawn with the default window view, which simply has the [0,
0] point on the top left, and bottom right has the window's size.

```cpp
sf::View camera;
int camWidth = 640;
int camHeight = 480;
camera.setSize(camWidth, camHeight);
camera.setCenter(camWidth/2, camHeight/2);

window->setView(camera);
```

With that, the window will draw from the perspective of the camera we created.
To test this, I created a 640x480 background image with fixed size borders and
positioned it at [0, 0], and also set the window to a resolution of 1024x576
(16:9), which is different than the camera's size and aspect ratio.

![bg](/assets/images/sfml-fitviewport/background.jpg)

When I run the game, I get the following screen:

![default viewport](/assets/images/sfml-fitviewport/default-viewport.jpg)

We can see that the image is perfectly stretched onto the window. The left and
right borders are thicker than the top and bottom ones, as most of the
stretching happened horizontally. Anything else we draw would get the same
effect. If I were to draw a pixel at the [640, 480] position, it would be drawn
as one or more pixels on the bottom right of the window.

The image needs to stretch (or shrink) equally and as much as possible on the x
and y axis, so that we maintain the aspect ratio of the view contained in the
window. To do that we need to understand viewports.

We can think of a viewport as the area of the window that we draw what the
camera sees, and is represented by the top left position and the sizes for the
width and height. In SFML, the values for each of these attributes go from 0 to
1 (to appear inside the window). This means that if a viewport has a position
of [0, 0] and a size of [1, 1], the view of the camera will be stretched across
the entire area of the window. As this is the default viewport values for a
`sf::View`, this is what happened to the previous example. So essentially, we
need to manipulate the viewport values to maintain the aspect ratio for our
camera.

Since we want the view to take as much space as possible of the screen, we can
assume either the width or the height of it will be extended across the window's
entire width or height. If the window's aspect ratio is wider than the view's,
then the viewport's height will be 1. Otherwise, the viewport's width will be 1.

![goal](/assets/images/sfml-fitviewport/goal.png)

The simplest way to know which viewport axis to shrink is to try doing the
calculation one way, and if it doesn't work, do it the other way. None of the
viewport sizes can be greater than 1.

```cpp
// Window's size in pixels
unsigned int winWidth  = window->getSize().x;
unsigned int winHeight = window->getSize().y;

// ratio formula -> aspect = width / height
// In this case: 640 / 480
float targetRatio = camWidth / camHeight;

// First try matching width (viewport.size.x = 1)
int targetW = winWidth;
int targetH = targetW / targetRatio; // from the formula: h = w / a

// Check if target height is greater than window's height.
if (targetH > winHeight) {
	// if so, forget about matching the width and match the height instead
	targetH = winHeight;
	targetW = targetH * targetRatio; // from the formula: w = h * a
}

// targetW and targetH are in pixels. Dividing them by the total
// window's width and height gives us a 0 to 1 value
float viewPortW = (float)targetW / winWidth;
float viewPortH = (float)targetH / winHeight;
```

If applied to the view, these values give us the correctly sized viewport:

![sized-viewport](/assets/images/sfml-fitviewport/sized-viewport.jpg)

However, we'd probably want to center it. To do that, the position of the
viewport needs to have half the size of the black bar, and we can get it by
subtracting  the window's size by the target's size.

```cpp
int targetX = (winWidth - targetW) / 2;
int targetY = (winHeight - targetH) / 2;

// targetX and targetY are in pixels. Divide by window's
// size to get 0 to 1 values
float viewPortX = (float)targetX / winWidth;
float viewPortY = (float)targetY / winHeight;
```

Now we can apply it to the camera.

```cpp
sf::Vector2f pos(viewPortX, viewPortY);
sf::Vector2f size(viewPortW, viewPortH);

camera.setViewport(sf::FloatRect(pos, size));
```

![sized-pos-viewport](/assets/images/sfml-fitviewport/sized-pos-viewport.png)

If the camera is moved, SFML will keep the black bars intact.

![sized-pos-moved-viewport](/assets/images/sfml-fitviewport/sized-pos-moved-viewport.jpg)

If the window is resizable, make a function from the code above and call it when there's a resize event (`sf::Event::Resized`)