# SmartWalk

Most of the mainstream web mapping applications implement location based rather standardized  A typical workflow 

Another is related to data ownership. Most service providers, including Google Maps, Mapy.cz, and many more, lock 

SmartWalk is a web application for keyword-aware walking route search that addresses two interesting problems: declarative route search and .

## Route search

Instead of location-based planning, the system allows users to express query in a declarative way, similar to [programming paradigms](https://stackoverflow.com/a/1784702).

A short example is when a tourist want to go for a walk to visit a `castle` and `museum` with certain properties, and stop by a `restaurant` on the way to the hotel.

Each query within SmartWalk contains the following three steps:

- configure customized categories (keyword with a set of quantifiable attributes);
- order them by optional arrows, for example both `castle` and `museum` should be `before` a `restaurant`;
- set a maximum walking distance.

A valid route is never longer than the predefined limit, visits at least one place from each category, and preserves ordering for all arrows.

The app supports a couple of other things, including standard directions.

## Data ownership

The app makes use of a [Solid](https://solidproject.org/about)-based decentralized storage so that the user can decide where to store personal data and who will have an access to it.

## I want to know details

See [frontend demo](https://smartwalk.vercel.app/) (although not connected to a backend), and [User documentation](https://zhukovdm.github.io/smartwalk/usr) with the comprehensive description of how to accomplish basic tasks.

[Administrator guide](https://zhukovdm.github.io/smartwalk/usr) provides the step-by-step procedure to get an instance of the system up and running on a personal computer with data samples covering beautiful [Prague](https://en.wikipedia.org/wiki/Prague), the capital of the Czech Republic.

If you want to participate, skim through [Programmer manual](https://zhukovdm.github.io/smartwalk/usr) to learn more about internals. Contributing is possible using standard [Pull Request](./CONTRIBUTING.md) workflow.
