from datetime import datetime
import matplotlib.pyplot as plt
import numpy as np
from scipy import stats

from lib.store import Store
from lib.smartwalk import baseUrl, make_request, time_to_milliseconds

count = [1, 3, 5, 7]
measurements = [[] for _ in range(len(count))]

def get_url(prefix: str, count: int) -> str:
    return f"{baseUrl}/advice/keywords?prefix={prefix.replace(' ', '+')}&count={count}"

def make_trial(prefix: str, count: int) -> float:
    start_time = datetime.now()

    _ = make_request(get_url(prefix, count))

    stop_time = datetime.now()

    return time_to_milliseconds(stop_time - start_time)

def measure() -> None:
    global count, measurements

    with Store() as store:
        (keywords, scores) = store.get_keywords()

        total = sum(scores)
        pmf = list(map(lambda score: score / total, scores))

        keywordRv = stats.rv_discrete(values=(np.arange(len(scores)), pmf))

        for i in range(len(count)):
            for _ in range(50):

                keyword = keywords[keywordRv.rvs()]
                prefix_max_len = min(len(keyword), 5)

                # decreasing 1/2, 1/4, ..., 1/(2^i), 1/(2^i).

                seq = list(map(lambda number: 1/(2**(number + 1)), np.arange(prefix_max_len)))
                seq[-1] *= 2

                prefixRv = stats.rv_discrete(values=(np.arange(prefix_max_len), seq))
                prefix_len = prefixRv.rvs() + 1

                measurements[i].append(make_trial(keyword[:prefix_len], count[i]))

def draw() -> None:
    global count, measurements

    fig, ax = plt.subplots()

    ax.boxplot(measurements)

    plt.xticks([1, 2, 3, 4], count)
    ax.set_ylabel("Response time, ms")

    fig.tight_layout()
    plt.savefig(f"./advice-keywords.pdf", format="pdf")

def main() -> None:
    measure()
    draw()

main()
