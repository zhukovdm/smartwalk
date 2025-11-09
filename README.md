# SmartWalk

This repository contains the source code for [**SmartWalk**](https://www.github.com/zhukovdm/smartwalk), a web application for keyword-aware route search. You can find the details about user experience, developer guide, and instructions on how to deploy your own instance in the [**Documentation**](https://zhukovdm.github.io/smartwalk-docs/).

## Motivation

Most of the mainstream web mapping applications ([Mapy.cz](https://mapy.cz/), [Google Maps](https://maps.google.com/), etc.) implement explicit location-based direction search. A typical workflow involves building a sequence incrementally, with the following three steps applied for each waypoint.

1. Search for places that meet user preferences, such as an art gallery.
1. Append one of them to the sequence, with possible manual reordering.
1. New path is presented to the user every time the sequence is altered.

In contrast, SmartWalk allows users to express search queries in terms of categories. A category consists of a keyword (e.g. castle, museum, or statue) and multiple attribute filters (has an image, with WiFi, capacity &geq; 7, etc.). For a place to be matched by a category, it must satisfy all constraints.

Given a starting point, destination, set of categories, and maximum walking distance, SmartWalk attempts to find [routes](https://smartwalk.vercel.app/search/routes) with a length approximaly equal to the provided upper bound that visit at least one place from each category. Besides routes, the application also supports [place](https://smartwalk.vercel.app/search/places) search and standard location-based [direction](https://smartwalk.vercel.app/search/direcs) search.
