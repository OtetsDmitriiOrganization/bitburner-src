import React, { useState } from 'react';
import { removePopup } from "../../ui/React/createPopup";
import { numeralWrapper } from "../../ui/numeralFormat";
import { dialogBoxCreate } from "../../../utils/DialogBox";
import { IOfficeSpace } from "../IOfficeSpace";

interface IProps {
    office: IOfficeSpace;
    corp: any;
    popupId: string;
}

export function ThrowPartyPopup(props: IProps): React.ReactElement {
    const [cost, setCost] = useState<number | null>(null);

    function changeCost(event: React.ChangeEvent<HTMLInputElement>): void {
        setCost(parseFloat(event.target.value));
    }

    function throwParty(): void {
        if (cost === null || isNaN(cost) || cost < 0) {
            dialogBoxCreate("Invalid value entered");
        } else {
            const totalCost = cost * props.office.employees.length;
            if (props.corp.funds.lt(totalCost)) {
                dialogBoxCreate("You don't have enough company funds to throw a party!");
            } else {
                props.corp.funds = props.corp.funds.minus(totalCost);
                let mult;
                for (let fooit = 0; fooit < props.office.employees.length; ++fooit) {
                    mult = props.office.employees[fooit].throwParty(cost);
                }
                dialogBoxCreate("You threw a party for the office! The morale and happiness " +
                                "of each employee increased by " + numeralWrapper.formatPercentage((mult-1)));
                removePopup(props.popupId);
            }
        }
    }

    function EffectText(props: {cost: number | null; office: IOfficeSpace}): React.ReactElement {
        let cost = props.cost;
        if(cost !== null && (isNaN(cost) || cost < 0)) return <p>Invalid value entered!</p>
        if(cost === null) cost = 0;
        return <p>Throwing this party will cost a total of {numeralWrapper.formatMoney(cost * props.office.employees.length)}</p>
    }

    function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
        if (event.keyCode === 13) throwParty();
    }

    return (<>
        <p>Enter the amount of money you would like to spend PER EMPLOYEE on this office party</p>
        <EffectText cost={cost} office={props.office} />
        <input autoFocus={true} className="text-input" type="number" style={{margin: "5px"}} placeholder="$ / employee" onChange={changeCost} onKeyDown={onKeyDown} />
        <button className="std-button" onClick={throwParty}>Throw Party</button>
    </>);
}