import { EnrichPipeline } from "../../shared/dist/src/index.js";
import Source from "./source.js";
import Target from "./target.js";
import Transformer from "./transformer.js";

export default class Pipeline extends EnrichPipeline<any, any> {

  constructor(source: Source, target: Target) {
    super(source, target, new Transformer());
  }
}
