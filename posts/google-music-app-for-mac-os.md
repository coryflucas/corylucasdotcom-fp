---
title: Google Music App for Mac OS
date: 2013-10-19 12:30 AM
---
I've switched to using a Mac at home for my my day to day computing and developement.  One of the applications I missed
from Linux was the now discontinued [Nuvola Player](http://nuvolaplayer.fenryxo.cz/home.html).  It's a simple desktop
application that wraps the websites of several popular cloud-based music players and provides a native desktop experience
to them.  One of the things I don't like about cloud-based music players is that my multimedia keys don't work with them,
and this app provides a solution.

# Moving to the Mac
So seeing as I had a Mac now, I figured I should try and dive into Objective C and learn a bit about the dev environment
in the Mac world.  I've thrown together a simple application at this point that wraps Google Music and provides support
for multimedia keys and contols via the dock menu.  I've called it MusicBox for now (I am terrible at naming things).  The
Source is on my [GitHub Page](https://github.com/coryflucas/MusicBox) as well as the DMG for
[version 1.0](https://github.com/coryflucas/MusicBox/releases/tag/1.0).

# Built for extensibility
Google Music is the service I am using currently, so it was the first goal for me.  MusicBox has been built with
extensibility in mind.  It will need a way to select which service provider to use, and after that adding a new provider
should be as simple as providing the functions to execute play/pause, etc. for that provider.  I hope to add Amazon Cloud
Player support soon.
