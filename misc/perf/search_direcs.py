import matplotlib
import matplotlib.pyplot as plt
import random
import time

from lib.store import Store
from lib.smartwalk import baseUrl, bboxes, make_request, serialize_request

PLACE_COUNT = [
    0,
    1,
    3,
    5
]
TRIALS = 50
MEASUREMENTS = [([], []) for _ in range(len(PLACE_COUNT))]

plt.rc("text", usetex=True)
plt.rc("font", family="serif")
matplotlib.rcParams.update({ 'font.size': 12 })
matplotlib.rcParams["axes.titlepad"] = 9

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
    """
    For each count, for each city in the list, draw at random `count` places
    and construct a direction.
    """

    global PLACE_COUNT, MEASUREMENTS, TRIALS

    with Store() as store:
        cities = [store.get_locations_within(bbox) for (bbox, _) in bboxes]

        for i in range(len(PLACE_COUNT)):
            (xpoints, ypoints) = MEASUREMENTS[i]

            for city in cities:
                for _ in range(TRIALS):
                    seq = [city[random.randint(0, len(city) - 1)]["location"] for _ in range(PLACE_COUNT[i] + 2)]
                    (x, y) = make_trial({ "waypoints": seq })

                    xpoints.append(x)
                    ypoints.append(y)

def draw() -> None:
    global PLACE_COUNT, MEASUREMENTS

    fig, axs = plt.subplots(2, 2)

    for i in range(len(PLACE_COUNT)):
        row = i // 2
        col = i  % 2

        ax = axs[row, col]
        (xpoints, ypoints) = MEASUREMENTS[i]

        ax.set_title(f"{PLACE_COUNT[i] + 2} points", fontsize=14)
        ax.scatter(xpoints, ypoints, facecolors="none", edgecolors="#0380fc", linewidth=0.55)

        if (row == 1):
            ax.set_xlabel("Distance, km")

        if (col == 0):
            ax.set_ylabel("Response time, ms")

        ax.tick_params(labelsize=10)

    fig.tight_layout()
    plt.savefig(f"./perf-search-direcs.pdf", format="pdf")

def main() -> None:
    measure()
    draw()
    print("Done.")

main()
