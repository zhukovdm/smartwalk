import axios from "axios";
import {
  act,
  cleanup,
  fireEvent,
  waitFor
} from "@testing-library/react";
import type { KeywordAdviceItem } from "../../../domain/types";
import { getKeywordAdviceItem } from "../../../utils/testData";
import {
  AppRenderOptions,
  renderWithProviders
} from "../../../utils/testUtils";
import * as smartwalkApi from "../../../utils/smartwalk";
import CategoryDialog, {
  type CategoryDialogProps
} from "../CategoryDialog";
import { context } from "../../../features/context";

/**
 * All tests in this test pack are terminated by the `cleanup` process. Without
 * explicit tear down, the framework will display a warning related to improper
 * usage of the `act(...)` construct.
 * 
 * https://github.com/testing-library/react-testing-library/issues/1051#issuecomment-1183303965
 */

/* For some reasons, axios bypass jest spy and does an actual call. The next
 * row resolves this problem by mocking the entire module. */
jest.mock("axios");

global.alert = jest.fn();
global.structuredClone = (val) => JSON.parse(JSON.stringify(val));

const getProps = (): CategoryDialogProps => ({
  category: {
    ...getKeywordAdviceItem(),
    filters: {
      es: {
        website: {}
      },
      bs: {
        delivery: false
      },
      ns: {
        capacity: {
          min: 20,
          max: 80
        }
      },
      ts: {
        name: "Abc"
      },
      cs: {
        cuisine: {
          inc: ["a"],
          exc: ["b"]
        }
      }
    }
  },
  onHide: jest.fn(),
  onInsert: jest.fn()
});

function render(props = getProps(), options: AppRenderOptions = {}) {
  return renderWithProviders(<CategoryDialog {...props} />, options);
}

describe("<CategoryDialog />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
    cleanup();
  });

  it("should render alert if no category is provided", () => {
    const { getByText } = render({
      ...getProps(),
      category: undefined
    });
    expect(getByText("Attributes are keyword-specific.")).toBeInTheDocument();
    cleanup();
  });

  test("discard button calls onHide", () => {
    const onHide = jest.fn();
    const { getByRole } = render({
      ...getProps(),
      category: undefined,
      onHide: onHide
    });
    fireEvent.click(getByRole("button", { name: "Discard" }));
    expect(onHide).toHaveBeenCalled();
    cleanup();
  });

  it("should disable keyword input if category is provided", () => {
    const { getByRole } = render();
    expect(getByRole("combobox", { name: "Keyword" })).toHaveAttribute("disabled");
    cleanup();
  })

  it("should use category filters if category is provided", () => {
    const { getByRole } = render();

    ["website", "delivery", "capacity between 20 and 80", "name", "cuisine"].forEach((name) => {
      expect(getByRole("checkbox", { name })).toHaveProperty("checked", true);
    });
    expect(getByRole("radio", { name: "Yes" })).toHaveProperty("checked", false);
    expect(getByRole("radio", { name: "No" })).toHaveProperty("checked", true);

    expect(getByRole("slider", { name: "Lower bound" })).toHaveValue("20");
    expect(getByRole("slider", { name: "Upper bound" })).toHaveValue("80");

    expect(getByRole("textbox", { name: "Text" })).toHaveValue("Abc");

    ["a", "b"].forEach((name) => {
      expect(getByRole("button", { name })).toBeInTheDocument();
    });

    cleanup();
  });

  test("Confirm button is disabled if no category is provided", () => {
    const { getByRole } = render({
      ...getProps(),
      category: undefined
    });
    expect(getByRole("button", { name: "Confirm" })).toHaveAttribute("disabled");

    cleanup();
  });

  it("should not update application state if fetch throws an error", async () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation();
    const fetchSpy = jest.spyOn(smartwalkApi, "fetchAdviceKeywords").mockRejectedValueOnce(new Error());

    const adviceKeywords = new Map<string, KeywordAdviceItem[]>();

    const { getByRole, queryByRole } = render({
      ...getProps(),
      category: undefined
    }, {
      context: {
        ...context,
        cache: { ...context.cache, adviceKeywords }
      }
    });

    act(() => {
      fireEvent.change(getByRole("combobox", { name: "Keyword" }), { target: { value: "m" } });
    });
    await waitFor(() => {
      expect(queryByRole("progressbar")).not.toBeInTheDocument();
    });

    expect(fetchSpy).toHaveBeenCalledWith("m");
    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(adviceKeywords.size).toBe(0);

    alertSpy.mockRestore();
    fetchSpy.mockRestore();
    cleanup();
  });

  it("should attempt to fetch for entered prefix", async () => {
    const names = ["A", "B", "C"];

    const fetchSpy = jest.spyOn(smartwalkApi, "fetchAdviceKeywords").mockResolvedValueOnce(
      names.map((name) => ({
        ...getKeywordAdviceItem(),
        keyword: `Keyword ${name}`
      })));

    const { getByRole, queryByRole } = render({
      ...getProps(),
      category: undefined
    });
    act(() => {
      fireEvent.change(getByRole("combobox", { name: "Keyword" }), { target: { value: "m" } });
    });
    await waitFor(() => {
      expect(queryByRole("progressbar")).not.toBeInTheDocument();
    });
    names.forEach((name) => {
      expect(getByRole("option", { name: `Keyword ${name}` })).toBeInTheDocument();
    });
    expect(fetchSpy).toHaveBeenCalledWith("m");

    fetchSpy.mockRestore();
    cleanup();
  });

  it("should not attempt to fetch for whitespace prefix (trimStart)", async () => {
    const fetchSpy = jest.spyOn(smartwalkApi, "fetchAdviceKeywords");

    const { getByRole, queryByRole } = render({
      ...getProps(),
      category: undefined
    });
    act(() => {
      fireEvent.change(getByRole("combobox", { name: "Keyword" }), { target: { value: " \t " } });
    });
    await waitFor(() => {
      expect(queryByRole("progressbar")).not.toBeInTheDocument();
    });
    expect(fetchSpy).toHaveBeenCalledTimes(0);

    fetchSpy.mockRestore();
    cleanup();
  });

  it("should cut off trailing whitespaces before api call", async () => {
    const fetchSpy = jest.spyOn(smartwalkApi, "fetchAdviceKeywords").mockResolvedValueOnce([]);

    const { getByRole, queryByRole, debug } = render({
      ...getProps(),
      category: undefined
    });
    act(() => {
      fireEvent.change(getByRole("combobox", { name: "Keyword" }), { target: { value: " \t a" } });
    });
    await waitFor(() => {
      expect(queryByRole("progressbar")).not.toBeInTheDocument();
    });
    expect(fetchSpy).toHaveBeenCalledWith("a");

    fetchSpy.mockRestore();
    cleanup();
  });

  it("should show filters for a selected option", async () => {
    const names = ["A", "B", "C"];
    const fetchSpy = jest.spyOn(smartwalkApi, "fetchAdviceKeywords").mockResolvedValueOnce(
      names.map((name) => (
        {
          ...getKeywordAdviceItem(),
          keyword: `Keyword ${name}`
        }
      )));

    const { getByRole, queryByRole } = render({
      ...getProps(),
      category: undefined
    });
    act(() => {
      fireEvent.change(getByRole("combobox", { name: "Keyword" }), { target: { value: "m" } });
    });
    await waitFor(() => {
      expect(queryByRole("progressbar")).not.toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(getByRole("option", { name: "Keyword A" }));
    });
    await waitFor(() => {
      expect(queryByRole("alert")).not.toBeInTheDocument();
    });
    ["website", "delivery", "capacity between 0 and 100", "name", "cuisine"].forEach((attr) => {
      expect(getByRole("checkbox", { name: attr })).toBeInTheDocument();
    });

    fetchSpy.mockRestore();
    cleanup();
  });

  it("should configure filters for an option and confirm", async () => {
    const names = ["A", "B", "C"];
    const fetchSpy = jest.spyOn(smartwalkApi, "fetchAdviceKeywords").mockResolvedValueOnce(
      names.map((name) => (
        {
          ...getKeywordAdviceItem(),
          keyword: `Keyword ${name}`
        }
      )));
    const onInsert = jest.fn();

    const { getByRole, queryAllByRole, queryByRole } = render({
      ...getProps(),
      category: undefined,
      onInsert: onInsert
    });

    act(() => {
      fireEvent.change(getByRole("combobox", { name: "Keyword" }), { target: { value: "m" } });
    });
    await waitFor(() => {
      expect(queryByRole("progressbar")).not.toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(getByRole("option", { name: "Keyword A" }));
    });
    await waitFor(() => {
      expect(queryByRole("alert")).not.toBeInTheDocument();
    });
    queryAllByRole("checkbox")?.forEach((checkbox) => {
      fireEvent.click(checkbox);
    });
    fireEvent.click(getByRole("button", { name: "Confirm" }));
    expect(onInsert).toHaveBeenCalledWith({
      ...getKeywordAdviceItem(),
      filters: {
        es: {
          website: {}
        },
        bs: {
          delivery: true
        },
        ns: {
          capacity: {
            min: 0,
            max: 100
          }
        },
        ts: {
          name: ""
        },
        cs: {
          cuisine: {
            inc: [],
            exc: []
          }
        }
      }
    });

    fetchSpy.mockRestore();
    cleanup();
  });
});
