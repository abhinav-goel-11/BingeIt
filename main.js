let puppeteer = require('puppeteer');
let fs = require("fs");
// let path = require("path");
const { default: jsPDF } = require("jspdf");

let str = "";
let input = process.argv.slice(2);
input.map(i => {str+=`${i} `});


(async function fn() {
    try{
        let browser = await puppeteer.launch({
            headless: false,defaultViewport: null,
            args: ["--start-maximized"],
        })
        let page = await browser.newPage();
        await page.goto("https://www.justwatch.com/");
        await page.waitForSelector('input[type="search"]');
        await page.click('input[type="search"]');
        await page.type('input[type="search"]',str,{delay:100});
        await page.keyboard.press('Enter',{delay: 100});
        // await waitFor()
        //wait for 1 second
        await page.waitForSelector('.search-result-item',{visibles:true});
        await page.click('.search-result-item');

        //imdb rating   
        await page.waitForSelector('a[target="_blank"]');
        let arr = await page.$$('a[target="_blank"]');
        let rating= [];
        if(arr.length!=0){
            
           for (let i = 0; i < arr.length; i++) {
               rating[i] = await page.evaluate(
            function (element) { return element.textContent }, arr[i]);

           }

        console.log(rating[1]);  
        }else{
            console.log("rating not avalable");
            let rating= [];
             rating[1] = "Not Avalable";
        }
        
         
        
        // genre
        let arr1 = await page.$$('.detail-infos__detail--values');
        let genre= [];
        if(arr1.length!=0){
            
           for (let i = 0; i < arr1.length; i++) {
               genre[i] = await page.evaluate(
            function (element) { return element.textContent }, arr1[i]);

           }
           console.log(genre[1]); 
        }else{
            console.log("Not Available");
           
            genre[1] = "Not Available";
        }
        // console.log(arr1.length);
          

          //plot
        let arr2 = await page.$$('.text-wrap-pre-line.mt-0');
        let synopsis= [];
        if(arr2.length!=0){
            
           for (let i = 0; i < arr2.length; i++) {
               synopsis[i] = await page.evaluate(
            function (element) { return element.textContent }, arr2[i]);

           }
           console.log(synopsis[1]);
        }else{
            console.log("Not Available");
            
            synopsis[1] = "Not Available";
        }
        // console.log(arr2.length);
          

           //runtime
           let ar = await page.$$('.detail-infos__detail--values');
           let runtime= [];
           if(ar.length!=0){
           
            for (let i = 0; i < ar.length; i++) {
             runtime[i] = await page.evaluate(
             function (element) { return element.textContent }, ar[i]);
 
            }
            console.log(runtime[2]); 
           }else{
               console.log("Not Available");
               
               runtime[2] = "Not Available";
           }
        
       

            // cast names
         let arr3 = await page.$$('.hidden-horizontal-scrollbar__items');
         let newArr = [];
         if(arr3.length!=0){
            let cast= [];
           for (let i = 0; i < arr2.length; i++) {
            cast[i] = await page.evaluate(
            function (element) { return element.textContent }, arr3[i]);

           }
        
           
           let namearr = cast[1].trim().split(" ");
        
           let j=0;
           for(let i=0 ; i<namearr.length ; i+=4){
           newArr[j++] = namearr[i] + " "+namearr[i+1] +"--"+namearr[i+2] +" "+namearr[i+3]
           }
           console.log(newArr);
         }else{
             console.log("Not Found");
             
             newArr = "Not Available";

         }
    
        

           await page.click('.price-comparison__grid__row__holder .presentation-type.price-comparison__grid__row__element__icon');

           pdfGenerator(rating[1],genre[1],synopsis[1],runtime[2],newArr);
        
    }catch(error){
        console.log(error);
    }
    
})()

function pdfGenerator(rating,genre,plot,runtime,CAST){
    
            if(fs.existsSync("details.pdf"))
                fs.unlinkSync("details.pdf");

            const doc = new jsPDF();

           
                doc.text("IMDB Rating -- ", 10 , 10);
                doc.text(rating, 50 , 10 );

                doc.text("Genre -- ", 10 , 40);
                doc.text(genre, 40 , 40 );

                doc.text("Plot -- ", 10 , 70);
                doc.text(plot, 32 , 70 );   
                
                doc.text("RUNTIME -- ", 10 , 100);
                doc.text(runtime, 45 , 100 );

                doc.text("Cast -- ", 10 , 130);
                doc.text(CAST, 40 , 130 );

            doc.save("details.pdf");

        
    
}




