import matplotlib.pyplot as plt
import random
import time

from lib.store import Store
from lib.smartwalk import baseUrl, bboxes, make_request, serialize_request

point_count = [0, 1, 3, 5]
measurements = [([], []) for _ in range(len(point_count))]

def get_url(request: dict) -> str:
    return f"{baseUrl}/search/direcs?query={serialize_request(request)}"

def make_trial(request: dict) -> (float, float):
    t0 = time.perf_counter_ns()
    res = make_request(get_url(request))
    t1 = time.perf_counter_ns()

    if (res.status_code != 200):
        raise Exception

    distance = res.json()[0]["distance"]
    time_dif = (t1 - t0) / 1_000_000

    return (distance / 1000.0, time_dif)

def measure() -> None:
    global point_count, measurements

    with Store() as store:
        cities = [store.get_locations_within(bbox) for (bbox, _) in bboxes]

        for i in range(len(point_count)):
            (xpoints, ypoints) = measurements[i]

            for city in cities:
                for _ in range(50):
                    seq = [city[random.randint(0, len(city) - 1)]["location"] for _ in range(point_count[i] + 2)]
                    (x, y) = make_trial({ "waypoints": seq })

                    xpoints.append(x)
                    ypoints.append(y)

def draw() -> None:
    global point_count, measurements

    fig, axs = plt.subplots(2, 2)

    for i in range(len(point_count)):
        row = i // 2
        col = i % 2

        ax = axs[row, col]
        (xpoints, ypoints) = measurements[i]

        ax.set_title(f"{point_count[i] + 2} points", fontsize=10)
        ax.scatter(xpoints, ypoints, facecolors="none", edgecolors="#0380fc", linewidth=0.55)

        if (row == 1):
            ax.set_xlabel("Distance, km")

        if (col == 0):
            ax.set_ylabel("Response time, ms")

    fig.tight_layout()
    plt.savefig(f"./perf-search-direcs.pdf", format="pdf")

def main() -> None:
    measure()
    draw()

main()
