document.addEventListener("DOMContentLoaded", () => {
    var currentCalc = "spitzer"

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

    document.querySelector("#calc_previous").addEventListener("click", () => {
        let active = document.querySelector("#calc_input .sm-grid")
        let previous = active.previousElementSibling
        if (previous != null) {
            active.classList.remove("sm-grid")
            active.classList.add("sm-hidden")
            
            previous.classList.remove("sm-hidden")
            previous.classList.add("sm-grid")
        }
    })
    document.querySelector("#calc_next").addEventListener("click", () => {
        let active = document.querySelector("#calc_input .sm-grid")
        let next = active.nextElementSibling
        if (next != null) {
            active.classList.add("sm-hidden")
            active.classList.remove("sm-grid")
    
            next.classList.remove("sm-hidden")
            next.classList.add("sm-grid")
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
    

    const makeCalculation = () => {
        updateRangeUI()
        
        loan_amount_field = document.querySelector("#loan_amount_field")
        several_months = document.querySelector("#several_months")
        foreign_exchange = document.querySelector("#foreign_exchange")
        annual_interest = document.querySelector("#annual_interest")
        monthly_payment_field = document.querySelector("#monthly_payment_field")

        let R = (annual_interest.value / 100 / 12 )
        if (currentCalc === "spitzer") {
            let ffm = ((1 / several_months.value) + (R * 1) / 2 * ((2 * several_months.value) + 1) / several_months.value)
            if (document.querySelector("#monthly_payment_selector").checked) {
                let Principle = loan_amount_field.value
                let monthlyPayment = (Principle * ffm) * (1 + foreign_exchange.value / 100)
                monthly_payment_field.value = monthlyPayment.toFixed()
    
            } else if (document.querySelector("#load_amount_selector").checked) {
                let monthlyPayment = monthly_payment_field.value
                let Principle = monthlyPayment / ffm
                loan_amount_field.value = Principle.toFixed()
            }
        } else if (currentCalc === "equal_fund") {
            let monthlyPayment = loan_amount_field.value / several_months.value  + (loan_amount_field.value * R )
            monthly_payment_field.value = monthlyPayment.toFixed()
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
})
