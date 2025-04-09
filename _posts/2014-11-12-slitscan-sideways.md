---
layout: post
type: posts
permalink: /2014/11/slitscan-sideways/
title: 'Sideways: Slitscan for Urban Travellers'
description: Sideways is a very small program created with Processing that creates
  2 slitscan bitmaps from a single video.
date: 2014-11-12 19:33:42 -0000
last_modified_at: 2017-08-07 19:50:41 -0000
publish: true
image:
  path: /assets/uploads/2014/11/sideways.jpg
categories:
- code
- imagen
tags:
- city
- continuity
- processing
- slitscan
---
**Sideways** is a very small program created with [Processing](http://www.processing.org) that creates 2 [slitscan](http://en.wikipedia.org/wiki/Slit-scan_photography) bitmaps from a single video. The video must be a first-person road shoot so both sides (left & right) are created from the edges.

## [](https://github.com/hspencer/sideways#instructions)instructions

* open the sketch in [Processing](http://www.processing.org). Download the program if necessary
* import your video to the sketch or place it in the `/data` directory
* update `filename` and `extension` variables accordingly

## [](https://github.com/hspencer/sideways#important-variables)important variables

* `scanBorderOffset` is the sample distance from the edge
* `scanWidth` is the slice width
* `widthFactor` is the multiplier of the output width

[Check the Repo in Github](https://github.com/hspencer/sideways "Sideways of Github")

### Examples

left side:  
![2014116114933_izq](/assets/uploads/2014/11/2014116114933_izq.png)  
right side:  
![2014116114933_der](/assets/uploads/2014/11/2014116114933_der.png)  
For more information on the topic, check this [Informal Catalogue of Slit-Scan Video Artworks and Research](http://www.flong.com/texts/lists/slit_scan/) created by Golan Levin.
