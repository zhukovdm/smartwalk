import matplotlib
import matplotlib.pyplot as plt
import numpy as np
from scipy import stats
import time

from lib.store import Store
from lib.smartwalk import baseUrl, make_request

ADVICE_ITEM_COUNTS = [
    1,
    3,
    5,
    7
]
TRIALS = 100
MEASUREMENTS = [[] for _ in range(len(ADVICE_ITEM_COUNTS))]

plt.rc("text", usetex=True)
plt.rc("font", family="serif")
matplotlib.rcParams.update({ 'font.size': 26 })

def get_url(prefix: str, count: int) -> str:
    return f"{baseUrl}/advice/keywords?prefix={prefix.replace(' ', '+')}&count={count}"

def make_trial(prefix: str, count: int) -> float:
    """
    Time of one request in milliseconds.
    """

    t0 = time.perf_counter_ns()
    res = make_request(get_url(prefix, count))
    t1 = time.perf_counter_ns()

    if (res.status_code != 200):
        raise Exception

    return (t1 - t0) / 1_000_000

def measure() -> None:
    global ADVICE_ITEM_COUNTS, MEASUREMENTS

    with Store() as store:
        (keywords, keywordRv) = store.get_keywords()

        for i in range(len(ADVICE_ITEM_COUNTS)):
            for _ in range(TRIALS):
                keyword = keywords[keywordRv.rvs()]
                prefix_max_len = min(len(keyword), 5)

                # decreasing 1/2, 1/4, ..., 1/(2^p), 1/(2^p).

                seq = list(map(lambda p: 1/(2**(p + 1)), np.arange(prefix_max_len)))
                seq[-1] *= 2

                prefixRv = stats.rv_discrete(values=(np.arange(prefix_max_len), seq))
                prefix_len = prefixRv.rvs() + 1

                MEASUREMENTS[i].append(make_trial(keyword[:prefix_len], ADVICE_ITEM_COUNTS[i]))

def draw() -> None:
    """
    Render a graph.
    """
    global ADVICE_ITEM_COUNTS, MEASUREMENTS

    fig, ax = plt.subplots()

    ax.boxplot(MEASUREMENTS)

    plt.xticks(list(range(1, len(ADVICE_ITEM_COUNTS) + 1)), ADVICE_ITEM_COUNTS)
    ax.set_xlabel("Max number of options")
    ax.set_ylabel("Response time, ms")
    ax.tick_params(labelsize=22)

    fig.tight_layout()
    plt.savefig(f"./perf-advice-keywords.pdf", format="pdf")

def main() -> None:
    measure()
    draw()
    print("Done.")

main()
