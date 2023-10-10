/** @format */

"use strict";

import { lambdaHandler } from "../../app.mjs";
import { expect } from "chai";
var event, context;

describe("Teste Planos", function () {
  it("verifies successful response", async () => {
    const result = await obterPlanos();
    expect(result.planos.lenght).to.be.equal(2);
  });
});
