document.addEventListener("DOMContentLoaded", () => {
    var currentCalc = "spitzer"

    const STATE = {
        loan_amount_field: 1000,
        several_months: 33,
        annual_interest: 4.32,
        foreign_exchange: 1.85,
        monthly_payment_field: 32.193,
        calculator: "Spitzer"
    }

    const resetCalcs = () => {
        document.querySelector("#equal_fund_calc").classList.remove("hidden")
        document.querySelector("#spitzer_calc").classList.remove("hidden")

        document.querySelector("#equal_fund_calc").classList.remove("grid")
        document.querySelector("#spitzer_calc").classList.remove("grid")
    }
    document.querySelector("#spitzer").addEventListener("click", () => {
        resetCalcs()
        document.querySelector("#equal_fund_calc").classList.add("hidden")
        document.querySelector("#spitzer_calc").classList.add("grid")
        currentCalc = "spitzer"
    })
    document.querySelector("#equal_fund").addEventListener("click", () => {
        resetCalcs()
        document.querySelector("#spitzer_calc").classList.add("hidden")
        document.querySelector("#equal_fund_calc").classList.add("grid")
        currentCalc = "equal_fund"
    })
    

    document.querySelector("#monthly_payment_selector").addEventListener("change", e => {
        if (e.target.checked === true) {
            document.querySelector("#loan_amount_form").classList.remove("active")
            document.querySelector("#monthly_payment_form").classList.add("active")
        }
    })

    document.querySelector("#load_amount_selector").addEventListener("change", e => {
        if (e.target.checked === true) {
            document.querySelector("#monthly_payment_form").classList.remove("active")
            document.querySelector("#loan_amount_form").classList.add("active")
        }
    })

    const updateFormUI = (computedVal, id) => {

        if ("loan_amount_ball" === id) {
            document.querySelector("#loan_amount_field").value = (computedVal * 10000).toFixed(2)
        }
            
        else if ("several_months_ball" === id) {
            document.querySelector("#several_months").value = (computedVal * 1).toFixed(2)
        }
            
        else if ("annual_interest_ball" === id) {
            document.querySelector("#annual_interest").value = (computedVal * 0.15).toFixed(2)
        }
        
        else if ("foreign_exchange_ball" === id) {
            document.querySelector("#foreign_exchange").value = (computedVal * 0.08).toFixed(2)
        }
            
        else if ("monthly_payment_ball" === id) {
            document.querySelector("#monthly_payment_field").value = (computedVal * 200).toFixed(2)
        }
    }

    const showCalc = () => {
        document.querySelector("#for_board").classList.remove("grid")
        document.querySelector("#disposal_board").classList.remove("grid")
        document.querySelector("#for_board").classList.add("hidden")
        document.querySelector("#disposal_board").classList.add("hidden")
    
    
        document.querySelector("#for_calc").classList.add("grid")
        document.querySelector("#calc_input").classList.add("grid")
        document.querySelector("#for_calc").classList.remove("hidden")
        document.querySelector("#calc_input").classList.remove("hidden")

        
        document.querySelector("#loan_amount_field").value = STATE.loan_amount_field
        document.querySelector("#several_months").value = STATE.several_months
        document.querySelector("#foreign_exchange").value = STATE.foreign_exchange
        document.querySelector("#annual_interest").value = STATE.annual_interest
        document.querySelector("#monthly_payment_field").value = STATE.monthly_payment_field
    }
    
    const showBoard = () => {
        // display prebriefs
        document.querySelector("#calc_type_value").textContent = STATE.calculator
        document.querySelector("#loan_amount_value").textContent = STATE.loan_amount_field
        document.querySelector("#payment_period_value").textContent = STATE.several_months
        document.querySelector("#annual_interest_value").textContent = `${STATE.annual_interest}%`
        document.querySelector("#indexation_value").textContent = `${STATE.foreign_exchange}%`

        
        // update board
        let disposal_board = document.querySelector("#disposal_board")
        disposal_board.querySelector("tbody").innerHTML = ""
        let state_copy = {...STATE}
        let totals = {
            monthlyRefund : 0,
            monthly_payment_field : 0,
            IndexComponentOnInterestRate : 0,
            paymentInterestComponent : 0,
            IndexComponentOnFund : 0,
            paidFundComponent : 0,
        }
        for (let i = 1; i <= STATE.several_months; i++) {
            let tableRow = document.createElement("tr")
            state_copy.paymentInterestComponent = state_copy.loan_amount_field * toMPercentage(state_copy.annual_interest)
            state_copy.loan_amount_field = parseFloat((state_copy.loan_amount_field + state_copy.paymentInterestComponent - state_copy.monthly_payment_field))
            state_copy.IndexComponentOnInterestRate = (toMPercentage(state_copy.foreign_exchange) * state_copy.paymentInterestComponent * i)
            state_copy.paidFundComponent = (state_copy.monthly_payment_field - state_copy.paymentInterestComponent)
            state_copy.IndexComponentOnFund = (toMPercentage(state_copy.foreign_exchange) * state_copy.paidFundComponent * i)
            state_copy.monthlyRefund = (state_copy.IndexComponentOnFund + state_copy.IndexComponentOnInterestRate + state_copy.monthly_payment_field)


            
            totals.monthlyRefund = (totals.monthlyRefund + state_copy.monthlyRefund)
            totals.monthly_payment_field = (totals.monthly_payment_field + state_copy.monthly_payment_field)
            totals.IndexComponentOnInterestRate = (totals.IndexComponentOnInterestRate + state_copy.IndexComponentOnInterestRate)
            totals.paymentInterestComponent = (totals.paymentInterestComponent + state_copy.paymentInterestComponent)
            totals.IndexComponentOnFund = (totals.IndexComponentOnFund + state_copy.IndexComponentOnFund)
            totals.paidFundComponent = (totals.paidFundComponent + state_copy.paidFundComponent)
            

            tableRow.innerHTML = `
                <td>${i}</td>
                <td>${state_copy.loan_amount_field.toFixed(2)}</td>
                <td>${state_copy.monthlyRefund.toFixed(2)}</td>
                <td>${state_copy.monthly_payment_field.toFixed(2)}</td>
                <td>${state_copy.IndexComponentOnInterestRate.toFixed(2)}</td>
                <td>${state_copy.paymentInterestComponent.toFixed(2)}</td>
                <td>${state_copy.IndexComponentOnFund.toFixed(2)}</td>
                <td>${state_copy.paidFundComponent.toFixed(2)}</td>
            `
            disposal_board.querySelector("tbody").appendChild(tableRow)

        }

        
        let tableRow = document.createElement("tr")
        tableRow.innerHTML = `
            <td>0</td>
            <td>${STATE.loan_amount_field}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        `
        disposal_board.querySelector("tbody").prepend(tableRow)

        // show totals in first row
        let totalstableRow = document.createElement("tr")
        totalstableRow.classList.add("totals")
        totalstableRow.innerHTML = `
            <td></td>
            <td></td>
            <td>${totals.monthlyRefund.toFixed(2)}</td>
            <td>${totals.monthly_payment_field.toFixed(2)}</td>
            <td>${totals.IndexComponentOnInterestRate.toFixed(2)}</td>
            <td>${totals.paymentInterestComponent.toFixed(2)}</td>
            <td>${totals.IndexComponentOnFund.toFixed(2)}</td>
            <td>${totals.paidFundComponent.toFixed(2)}</td>
        `
        disposal_board.querySelector("tbody").prepend(totalstableRow)


        document.querySelector("#for_calc").classList.remove("grid")
        document.querySelector("#calc_input").classList.remove("grid")
        document.querySelector("#for_calc").classList.add("hidden")
        document.querySelector("#calc_input").classList.add("hidden")
    
        
        document.querySelector("#for_board").classList.add("grid")
        document.querySelector("#disposal_board").classList.add("grid")
        document.querySelector("#for_board").classList.remove("hidden")
        document.querySelector("#disposal_board").classList.remove("hidden")
    }

    let disposal_board_activator = document.querySelector("#disposal_board_activator")
    disposal_board_activator.addEventListener("click", () => {
        if (document.querySelector("#calc_input").classList.contains("grid")) {
            showBoard()
            disposal_board_activator.textContent = "Return to Calculator"
        } else if (document.querySelector("#disposal_board").classList.contains("grid")) {
            showCalc()
            disposal_board_activator.textContent = "Disposal Board"
        }
    })


    document.querySelectorAll(".calc-group .ball").forEach(elem => {
        elem.draggable = true
        elem.addEventListener("drag", e => {
            if (document.querySelector("#monthly_payment_selector").checked && elem.id == "monthly_payment_ball") {
                return
            } else if (document.querySelector("#load_amount_selector").checked && elem.id == "loan_amount_ball") {
                return
            }
            let computedVal
            if (e.clientY >= elem.parentElement.getBoundingClientRect().top && e.clientY <= elem.parentElement.getBoundingClientRect().bottom) {
                let fromTop = (e.clientY / elem.parentElement.getBoundingClientRect().bottom * 100).toFixed()
                computedVal = 100 - fromTop
                styleTrack(elem.id, computedVal)

                updateFormUI(computedVal, elem.id)
    
                makeCalculation()
            }
        })
    })

    document.querySelector("#loan_amount_field")
        .addEventListener("change", () => makeCalculation())
    document.querySelector("#several_months")
        .addEventListener("change", () => makeCalculation())
    document.querySelector("#foreign_exchange")
        .addEventListener("change", () => makeCalculation())
    document.querySelector("#annual_interest")
        .addEventListener("change", () => makeCalculation())
    document.querySelector("#monthly_payment_field")
        .addEventListener("change", () => makeCalculation())
    

    const toMPercentage = value => value / (12 * 100)

    const makeCalculation = () => {
        updateRangeUI()
        
        loan_amount_field = document.querySelector("#loan_amount_field")
        several_months = document.querySelector("#several_months")
        foreign_exchange = document.querySelector("#foreign_exchange")
        annual_interest = document.querySelector("#annual_interest")
        monthly_payment_field = document.querySelector("#monthly_payment_field")

        let R = toMPercentage(parseFloat(annual_interest.value))
        if (currentCalc === "spitzer") {
            STATE.calculator = "spitzer"
            
            let T = parseFloat(several_months.value)
            let R = toMPercentage(annual_interest.value)
            let I = toMPercentage(foreign_exchange.value || 0)
            R = R * ( 1 + I)
            
            let ffm = ((R * Math.pow((1 + R), T)) / (Math.pow((1 + R), T) - 1))

            // let M = ( P * R) / ( 1 - Math.pow((1 + R), -T) )
            
            if (document.querySelector("#monthly_payment_selector").checked) {

                let P = parseFloat(loan_amount_field.value)
                P = P * ( 1 + I)

                let M = P * ffm
                STATE.monthly_payment_field = Mz
                monthly_payment_field.value = M.toFixed()

            } else if (document.querySelector("#load_amount_selector").checked) {
                let M = parseFloat(monthly_payment_field.value)
                STATE.monthly_payment_field = M

                let P_adjusted = M / ffm
                let P = P_adjusted / ( 1 + I)
                loan_amount_field.value = P.toFixed()
            }


        } else if (currentCalc === "equal_fund") {
            STATE.calculator = "Equal Fund"
            
            let monthlyPayment = loan_amount_field.value / several_months.value  + (loan_amount_field.value * R )
            monthly_payment_field.value = monthlyPayment.toFixed()
        }

        if (parseFloat(loan_amount_field.value) > 0 & parseFloat(several_months.value) > 0 & parseFloat(foreign_exchange.value) > 0 & parseFloat(annual_interest.value) > 0 & parseFloat(monthly_payment_field.value) > 0) {
            document.querySelector("#disposal_board_activator").disabled = false
            STATE.loan_amount_field = parseFloat(loan_amount_field.value)
            STATE.several_months = parseFloat(several_months.value)
            STATE.foreign_exchange = parseFloat(foreign_exchange.value)
            STATE.annual_interest = parseFloat(annual_interest.value)
        }
        
        updateRangeUI()       

    }

    const updateRangeUI = () => {
        
        loan_amount_field = document.querySelector("#loan_amount_field")
        several_months = document.querySelector("#several_months")
        annual_interest = document.querySelector("#annual_interest")
        foreign_exchange = document.querySelector("#foreign_exchange")
        monthly_payment_field = document.querySelector("#monthly_payment_field")


        styleTrack("loan_amount_ball", loan_amount_field.value / 10000)
        styleTrack("several_months_ball", several_months.value / 1)
        styleTrack("annual_interest_ball", annual_interest.value / 0.15)
        styleTrack("foreign_exchange_ball", foreign_exchange.value / 0.08)
        styleTrack("monthly_payment_ball", monthly_payment_field.value / 200)
        
    }

    const styleTrack = (id, value) => {
        if (value < 0 || value > 100) {
            return
        }
        let elem = document.querySelector(`#${id}`)
        elem.style.bottom = `${value}%`
        elem.style.transform = `translate(-50%, ${value}%)`
    }

    
    // document.querySelector("#disposal_board_activator").click()
    document.querySelectorAll("td").forEach(elem => {
        elem.addEventListener("click", e => {
            if (!e.ctrlKey) {
                document.querySelectorAll("td.active").forEach(elem => elem.classList.remove("active"))
            }
            elem.classList.toggle("active")

            window.addEventListener("keyup", e => {
                if (e.key == "Escape") {
                    document.querySelectorAll("td.active").forEach(elem => elem.classList.remove("active"))
                }
            })
            
            // elem.addEventListener("mousedown", e => {
            //     document.querySelectorAll("td").forEach(elem => {
            //         elem.addEventListener("mouseover", e => {
            //             console.log(e)
            //             elem.classList.add("active")
            //         })
            //     })
            // })
        })
    })
})
