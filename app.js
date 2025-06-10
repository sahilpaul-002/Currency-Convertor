const apiKey = "7cf5f661cf5c0ab3db308e26";
const baseUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/pair`;

// Select the html drop down element
const dropDown = document.querySelectorAll(".dropDown select")
// Select the html button element
const btn = document.querySelector("form button");
// Select the from currency
const fromCurrency=document.querySelector(".from select");
// Select the to currency
const toCurrency=document.querySelector(".to select");

window.addEventListener("load", ()=>{
    updateRate();
});

// Populate the drop down
for(let select of dropDown)
{
    for (currencyCode in countryList)
    {
        let newOption = document.createElement("option");
        newOption.innerText=currencyCode;
        newOption.value=currencyCode;
        // Check if the currency code is USD then set the from currency to USD
        if (select.name==="from" && currencyCode==="USD")
        {
            newOption.selected="selected"
        }
        // Check if the currency code is INR then set the to currency to INR
        else if (select.name==="to" && currencyCode==="INR")
        {
            newOption.selected="selected"
        }
        select.append(newOption);
    }
    // Add event listener to catch the change occuring in the form element
    select.addEventListener("change", (event)=> {
        updateFlag(event.target);
        updateMsg(event.target);
    })
};

// Update flag logic
const updateFlag = (element) => {
    let currencyCode=element.value;
    let countryCode=countryList[currencyCode];
    let imgLink=`https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = imgLink;
};

// Logic to update the conversion rate on landing
const updateRate= async ()=> {
    let conversionRate;
    const url=`${baseUrl}/${fromCurrency.value.toUpperCase()}/${toCurrency.value.toUpperCase()}`;
    let response = await fetch(url);
    if (response.status == "200")
    {
        let data = await response.json();
        console.log(data);
        conversionRate = data.conversion_rate;
    }
    // Select the message element
    let msg=document.querySelector(".msg");
    let message = msg.innerText;
    // Logic for changing the coversion rate
    let startIndex = message.indexOf("= ") + 2; // +2 to skip "= "
    let endIndex = message.length-4; // -3 to skip the country code
    message = message.slice(0, startIndex) +
        conversionRate +
        message.slice(endIndex);
    msg.innerText=message;
}

// Logic to update the conversion rate message
const updateMsg= async (element)=> {
    let msg=document.querySelector(".msg");
    let message = msg.innerText;
    // Logic to update the conversion rate
    updateRate();
    // Logic for changing the coutry names
    let currencyCode=element.value;
    if (element.name=="from")
    {
        // let message = msg.innerText;
        let startIndex = message.indexOf("1 ") + 2; // +2 to skip "1 "
        let endIndex = message.indexOf(" =");

        message = 
            message.slice(0, startIndex) + 
            currencyCode + 
            message.slice(endIndex);
    }
    else if (element.name=="to")
    {
        // let message = msg.innerText;
        let startIndex = message.length-3; // -3 to skip the currency code
        let endIndex = message.length;

        message = 
            message.slice(0, startIndex) + 
            currencyCode + 
            message.slice(endIndex);
    }
    // Set value to msg html element
    msg.innerText=message;
}

// Logic for currency convertor
btn.addEventListener("click", async (event)=> {
    event.preventDefault();
    // Select the  currency amount input
    let amount=document.querySelector("#enterAmount");
    // Select the convert currency amount input
    let convertedamount=document.querySelector("#convertedAmount");
    let amountValue= amount.value;
    if (amountValue==="" | amountValue < 0){
        amount.value="0"
        amountValue = 0;
    }
    const url=`${baseUrl}/${fromCurrency.value.toUpperCase()}/${toCurrency.value.toUpperCase()}/${amountValue}`;
    let response = await fetch(url);
    if (response.status == "200")
    {
        let data = await response.json();
        let conversionRate = data.conversion_rate;
        let finalAmount = (amountValue * conversionRate).toFixed(4);
        convertedAmount.value = finalAmount;
    }
});