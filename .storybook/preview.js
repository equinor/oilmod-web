import {setCompodocJson} from "@storybook/addon-docs/angular";
import docJson from "../documentation.json";
import '!style-loader!css-loader!sass-loader!../src/styles.scss'

setTimeout(() => {
  document.body.classList.add("mat-typography")
  document.body.style.paddingLeft = '0';
}, 0);

setCompodocJson(docJson);


export const parameters = {
  actions: {argTypesRegex: "^on[A-Z].*"},
}
