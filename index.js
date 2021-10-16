import fetch from 'node-fetch';
import { createBrotliCompress } from 'zlib';

const nviewUrl = 'https://comicabc.com/js/nview.js'

// our target
const url = 'https://comicabc.com/online/new-19317.html?ch=1'

// we need these functions to eval script
// but these functions are provided in https://comic.aya.click/js/nview.js
const lcRegex = /(function lc.*)/
const nnRegex = /(function nn.*)/
const mmRegex = /(function mm.*)/

async function Run() {
    const resp = await fetch(url)
    const html = await resp.text()

    // mock object to eval(script)
    let document = {
        location: url,
        getElementById: () => ({
            src: ""
        })
    }
    const spp = () => {}

    // Get raw string of function lc(), nn(), mm()
    const nviewResp = await fetch(nviewUrl)
    const nviewScript = await nviewResp.text()
    // console.log(`nviewScript = ${nviewScript}`)

    const lcScript = nviewScript.match(lcRegex)[1]
    const nnScript = nviewScript.match(nnRegex)[1]
    const mmScript = nviewScript.match(mmRegex)[1]

    //console.log(`lcScript = ${lcScript}`)
    //console.log(`nnScript = ${nnScript}`)
    //console.log(`mmScript = ${mmScript}`)

    // cut only the javaScript part
    let script = html.substring(html.indexOf('function request'))
    script = script.substring(0, script.indexOf('</script>'))
    //console.log(`script = ${script}`)

    // fetch assign img src part:
    // 
    // after split & filter the output would be like:
    //     ge(k0__0r_4av(6)+k0__0r_4av(5)).src=unescape(w1q9vcac6j+w1q9vcac6j+k0__0r_4av(4)+un_5fae6_(bg21mnh, 0, 1)+um1a2k1q9+hac6j0hp_+k0__0r_4av(3)+k0__0r_4av(2)+k0__0r_4av(3)+w1q9vcac6j+un_5fae6_(bg21mnh,1,1)+w1q9vcac6j+ti+w1q9vcac6j+i9g00mg21+w1q9vcac6j+nn(p)+e_4avn23+un_5fae6_(er3i6ho_,mm(p),3)+um1a2k1q9+k0__0r_4av(1))
    // 
    // we use replace to remove "ge(k0__0r_4av(6)+k0__0r_4av(5)).src=" part
    let srcScript = script.split(';').filter(el => el.includes('src='))[0].replace(/.*\.src=/, '')
    //console.log(`srcScript = ${srcScript}`)

    // we need lc(), nn(), mm(), spp() to eval script
    // for spp(), we only need to mock it since it does not matters
    let answer = [
        lcScript,
        nnScript,
        mmScript,
        script,
        `(${srcScript})`
    ].join(';')
    
    var src = eval(answer)
    console.log(`src = ${src}`) // output: //img8.8comic.com/4/19317/1/001_HJ3.jpg
}

Run()
