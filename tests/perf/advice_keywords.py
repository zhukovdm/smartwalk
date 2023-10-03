import matplotlib.pyplot as plt
import numpy as np
from scipy import stats
import time

from lib.store import Store
from lib.smartwalk import baseUrl, make_request

advice_item_counts = [1, 3, 5, 7]
measurements = [[] for _ in range(len(advice_item_counts))]

def get_url(prefix: str, count: int) -> str:
    return f"{baseUrl}/advice/keywords?prefix={prefix.replace(' ', '+')}&count={count}"

def make_trial(prefix: str, count: int) -> float:
    t0 = time.perf_counter_ns()
    res = make_request(get_url(prefix, count))
    t1 = time.perf_counter_ns()

    if (res.status_code != 200):
        raise Exception

    return (t1 - t0) / 1_000_000

def measure() -> None:
    global advice_item_counts, measurements

    with Store() as store:
        (keywords, keywordRv) = store.get_keywords()

        for i in range(len(advice_item_counts)):
            for _ in range(100):
                keyword = keywords[keywordRv.rvs()]
                prefix_max_len = min(len(keyword), 5)

                # decreasing 1/2, 1/4, ..., 1/(2^p), 1/(2^p).

                seq = list(map(lambda p: 1/(2**(p + 1)), np.arange(prefix_max_len)))
                seq[-1] *= 2

                prefixRv = stats.rv_discrete(values=(np.arange(prefix_max_len), seq))
                prefix_len = prefixRv.rvs() + 1

                measurements[i].append(make_trial(keyword[:prefix_len], advice_item_counts[i]))

def draw() -> None:
    global advice_item_counts, measurements

    fig, ax = plt.subplots()

    ax.boxplot(measurements)

    plt.xticks(list(range(1, len(advice_item_counts) + 1)), advice_item_counts)
    ax.set_xlabel("Max number of options")
    ax.set_ylabel("Response time, ms")

    fig.tight_layout()
    plt.savefig(f"./perf-advice-keywords.pdf", format="pdf")

def main() -> None:
    measure()
    draw()

main()
