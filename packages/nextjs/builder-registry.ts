"use client";

import { Builder, builder } from "@builder.io/react";
import { QuestSimulator } from "~~/components/quest";

builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!);

Builder.registerComponent(QuestSimulator, {
  name: "Simulator",
  inputs: [
    {
      name: "title",
      type: "string",
    },
  ],
});
