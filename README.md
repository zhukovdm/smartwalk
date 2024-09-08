# SmartWalk

This repository contains the source code for [**SmartWalk**](https://www.github.com/zhukovdm/smartwalk), a web application for keyword-aware route search. Check out the [**Demo**](https://smartwalk.vercel.app/) (although *not* connected to a backend) to get a sense of how the application might look and feel.

The documentation is hosted at https://zhukovdm.github.io/smartwalk-docs/.

## Motivation

Most of the mainstream web mapping applications ([Mapy.cz](https://mapy.cz/), [Google Maps](https://maps.google.com/), etc.) implement explicit location-based *direction* search. A typical workflow involves building a sequence, with the following three steps applied for *each* waypoint.

1. Search for places that might satisfy imposed constraints (e.g., a museum free of charge).
1. Append one of them to the sequence, with possible manual reordering.
1. New path is presented to the user right after the sequence configuration is altered.

In contrast, *SmartWalk* enables users to formulate search queries in terms of *categories*. A category is composed of a *keyword* (castle, museum, statue, etc.) and *attribute filters* (has an image, with WiFi, capacity &geq; *N*, etc.). For a place to be matched by a category, it must satisfy all constraints.

Given a starting point, destination, set of categories, and maximum walking distance, *SmartWalk* attempts to find *routes* with a length never longer than the predefined limit that visit at least one place from each category.

Besides routes, the application also supports *place* and standard location-based direction search.
