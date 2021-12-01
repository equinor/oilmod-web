import {setCompodocJson} from "@storybook/addon-docs/angular";
import docJson from "./documentation.json";

setTimeout(() => {
  document.body.classList.add("mat-typography", "mat-app-background")
  document.body.style.paddingLeft = '0';
}, 0);

setCompodocJson(docJson);

export const parameters = {
  actions: {argTypesRegex: "^on[A-Z].*"},
}
