from datetime import datetime
import matplotlib.pyplot as plt
import numpy as np
from scipy import stats

from lib.store import Store
from lib.smartwalk import baseUrl, make_request, time_to_milliseconds

advice_item_counts = [1, 3, 5, 7]
measurements = [[] for _ in range(len(advice_item_counts))]

def get_url(prefix: str, count: int) -> str:
    return f"{baseUrl}/advice/keywords?prefix={prefix.replace(' ', '+')}&count={count}"

def make_trial(prefix: str, count: int) -> float:
    start_time = datetime.now()
    _ = make_request(get_url(prefix, count))
    stop_time = datetime.now()

    return time_to_milliseconds(stop_time - start_time)

def measure() -> None:
    global advice_item_counts, measurements

    with Store() as store:
        (keywords, keywordRv) = store.get_keywords()

        for i in range(len(advice_item_counts)):
            for _ in range(50):

                keyword = keywords[keywordRv.rvs()]
                prefix_max_len = min(len(keyword), 5)

                # decreasing 1/2, 1/4, ..., 1/(2^i), 1/(2^i).

                seq = list(map(lambda number: 1/(2**(number + 1)), np.arange(prefix_max_len)))
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
