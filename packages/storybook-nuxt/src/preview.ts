

const nuxtApp = () => import(('#app/entry')).then((m) => m.default).catch((err) => {});
// inject nuxt root element
const root = document.createElement('div' );
root.id = '__nuxt';
root.hidden = true;
document.body.appendChild(root);

const app = nuxtApp()


app.then( async (m) => { 
    console.log('  vueApp mounted: ',m)
}).catch((err) => {  console.log('  vueApp error:',err)})

export default app;
