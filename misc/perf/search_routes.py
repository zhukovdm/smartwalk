import matplotlib
import matplotlib.pyplot as plt
import random
import time

from lib.drawing import enrich_subplot
from lib.store import Store
from lib.smartwalk import baseUrl, make_request, serialize_request

CATEGORY_COUNTS = [
    1,
    2,
    3,
    5
]
MAX_DISTANCES = [
    1.0,
    3.0,
    6.0,
    10.0,
    15.0,
    30.0
]
TRIALS = 50
MEASUREMENTS = [[[] for _ in range(len(MAX_DISTANCES))] for _ in range(len(CATEGORY_COUNTS))]

plt.rc("text", usetex=True)
plt.rc("font", family="serif")
matplotlib.rcParams.update({ 'font.size': 12 })
matplotlib.rcParams["axes.titlepad"] = 9

def get_url(request: dict) -> str:
    return f"{baseUrl}/search/routes?query={serialize_request(request)}"

def make_trial(request: dict) -> float:
    t0 = time.perf_counter_ns()
    res = make_request(get_url(request))
    t1 = time.perf_counter_ns()

    if (res.status_code != 200):
        raise Exception

    return (t1 - t0) / 1_000_000

def measure() -> None:
    global CATEGORY_COUNTS, MEASUREMENTS, TRIALS

    with Store() as store:
        locations = store.get_locations_within((-180.0, 85.06, 180.0, -85.06))
        (keywords, keywordRv) = store.get_keywords()

        for c in range(len(CATEGORY_COUNTS)):
            for d in range(len(MAX_DISTANCES)):
                maxDistance = MAX_DISTANCES[d] * 1_000.0
                print(f"Retrieving route of at most {maxDistance} m with {CATEGORY_COUNTS[c]} categories...")

                for _ in range(TRIALS):
                    point = locations[random.randint(0, len(locations) - 1)]["location"]

                    request = {
                        "source": point,
                        "target": point,
                        "maxDistance": maxDistance,
                        "categories": [{
                            "keyword": keywords[keywordRv.rvs()],
                            "filters": {}
                        } for _ in range(CATEGORY_COUNTS[c])],
                        "arrows": []
                    }
                    MEASUREMENTS[c][d].append(make_trial(request))

def draw() -> None:
    global CATEGORY_COUNTS, MAX_DISTANCES, MEASUREMENTS

    lim = 2_000
    fig, axs = plt.subplots(2, 2)

    #

    ax = axs[0, 0]
    ax.boxplot(MEASUREMENTS[0])
    enrich_subplot(ax, MAX_DISTANCES, lim)
    ax.set_title("1 category", fontsize=14)
    ax.set_ylabel("Response time, ms")
    ax.set_ylim(ax.get_ylim()[0], max(ax.get_ylim()[1], lim))
    ax.tick_params(labelsize=10)

    #

    ax = axs[0, 1]

    ax.boxplot(MEASUREMENTS[1])
    enrich_subplot(ax, MAX_DISTANCES, lim)
    ax.set_title("2 categories", fontsize=14)
    ax.set_ylim(ax.get_ylim()[0], max(ax.get_ylim()[1], lim))
    ax.tick_params(labelsize=10)

    #

    ax = axs[1, 0]

    ax.boxplot(MEASUREMENTS[2])
    enrich_subplot(ax, MAX_DISTANCES, lim)
    ax.set_title("3 categories", fontsize=14)
    ax.set_xlabel("Max distance, km")
    ax.set_ylabel("Response time, ms")
    ax.set_ylim(ax.get_ylim()[0], max(ax.get_ylim()[1], lim))
    ax.tick_params(labelsize=10)

    #

    ax = axs[1, 1]

    ax.boxplot(MEASUREMENTS[3])
    enrich_subplot(ax, MAX_DISTANCES, lim)
    ax.set_title("5 categories", fontsize=14)
    ax.set_xlabel("Max distance, km")
    ax.set_ylim(ax.get_ylim()[0], max(ax.get_ylim()[1], lim))
    ax.tick_params(labelsize=10)

    fig.tight_layout()
    plt.savefig(f"./perf-search-routes.pdf", format="pdf")

def main() -> None:
    measure()
    draw()

main()
