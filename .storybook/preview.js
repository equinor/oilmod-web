import {setCompodocJson} from "@storybook/addon-docs/angular";
import docJson from "../dist/documentation.json";
import '!style-loader!css-loader!sass-loader!../src/styles.scss'

setTimeout(() => {
  document.body.classList.add("mat-typography")
  document.body.style.paddingLeft = '0';
  const btn = document.createElement('button');
  btn.innerText = 'Theme'
  btn.style.position = 'fixed';
  btn.style.zIndex = '9999';
  btn.style.bottom = '10px';
  btn.style.right = '10px';
  btn.style.height = '24px';
  btn.style.width = '60px';
  btn.addEventListener('click', () => {
    const dark = document.body.classList.contains('sto-dark-theme');
    document.body.classList.remove('sto-dark-theme')
    if (!dark) {
      document.body.classList.add('sto-dark-theme')
    }
  })
  document.body.append(btn);
}, 0);

setCompodocJson(docJson);


export const parameters = {
  actions: {argTypesRegex: "^on[A-Z].*"},
}
