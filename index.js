import express from 'express';
import bodyParser from 'body-parser';
import moment from 'moment';

const app = express();

app.use(bodyParser.json());

function monthCount(start, end) {
    let months = moment(end, "YYYY-MM-DD").diff(moment(start, "YYYY-MM-DD"), "months");
    return months <= 0 ? 0 : months;
}

function dateRange (start, end) {
    const months = []
    const dateStart = moment(start, "YYYY-MM-DD");
    const dateEnd = moment(end, "YYYY-MM-DD");
    while (dateEnd.diff(dateStart, "months") >= 0) {
     months.push(dateStart.format("YYYY-MM-DD"))
     dateStart.add(1, "month");
    }
    return months.reverse();
   }

function calcPaymentplan (req) {

    const dates = dateRange(req.datoForsteInnbetaling,req.utlopsDato);
    const maanedsrente = (req.nominellRente / 100) / 12;
    let terminteller = monthCount(req.datoForsteInnbetaling, req.utlopsDato);
    let restgjeld = req.laanebelop;
    const terminbelop = req.laanebelop * ((maanedsrente) / (1 - Math.pow(1 + maanedsrente, (-terminteller))));
    let innbetalinger = [
        {
            laanebelop: req.laanebelop,
            dato: req.saldoDato,
            innbetaling: 0,
            gebyr: 0,
            renter: 0,
            total: 0
        }
    ];
    
    while (restgjeld > 0) {

        let renter = restgjeld * maanedsrente;
        let avdrag = terminbelop - renter;
        restgjeld -= avdrag;
        
        innbetalinger.push({
            restgjeld,
            dato: dates.pop(),
            innbetaling: avdrag,
            gebyr: req.terminGebyr,
            renter: renter,
            total: terminbelop + req.terminGebyr
        })
        terminteller--;
    }

    const nedbetalingsplan = {
        nedbetalingsplan:  {
            innbetalinger: innbetalinger
        }
    }
    return nedbetalingsplan;
}

app.post('/', (req,res) => {
    if (req.body.laanebelop === undefined || req.body.nominellRente === undefined || req.body.terminGebyr === undefined 
        || req.body.utlopsDato === undefined || req.body.saldoDato === undefined || req.body.datoForsteInnbetaling === undefined ) {
        return res.status(400).send({ error: "Missing data" })
    }
    const paymentplan = JSON.stringify(calcPaymentplan(req.body));
    res.send(paymentplan);
});

app.get('/', (req,res) => {
    res.send('This is an API for calculating annuity loans. Please send a POST-request with JSON-data to receive a payment plan.')
});

app.listen(process.env.PORT || 5000);