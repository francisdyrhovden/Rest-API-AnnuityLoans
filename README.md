## Annuity Loan Calculator

A Rest-API for calculating annuity loans. Returns a payment plan 💰

Hosted on: [https://annuityloans.herokuapp.com/](https://annuityloans.herokuapp.com/)

### How to use:

Send a POST-request to the link with the following payload-format:

```json
{ 
	"laanebelop": 2000000,
 	"nominellRente": 3, 
 	"terminGebyr":30, 
 	"utlopsDato":"2045-01-01", 
 	"saldoDato":"2020-01-01", 
 	"datoForsteInnbetaling":"2020-02-01", 
 	"ukjentVerdi":"TERMINBELOP" 
}
```