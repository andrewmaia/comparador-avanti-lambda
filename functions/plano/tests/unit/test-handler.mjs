/** @format */

"use strict";

import { lambdaHandler, obterPlanos } from "../../app.mjs";
import { expect } from "chai";
var event, context;

describe("Teste Planos", function () {
  it("verifies successful response", async () => {
    const result = await obterPlanos();
    expect(result.planos.length).to.be.equal(2);
  });
});
