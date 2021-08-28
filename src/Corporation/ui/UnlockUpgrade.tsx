// React Components for the Unlock upgrade buttons on the overview page
import React from "react";

import { numeralWrapper } from "../../ui/numeralFormat";
import { dialogBoxCreate } from "../../../utils/DialogBox";

interface IProps {
    upgradeData: number[];
    corp: any;
}

export function UnlockUpgrade(props: IProps): React.ReactElement {
    const data = props.upgradeData;
    const text = `${data[2]} - ${numeralWrapper.formatMoney(data[1])}`;
    const tooltip = data[3];
    function onClick(): void {
        const corp = props.corp;
        if (corp.funds.lt(data[1])) {
            dialogBoxCreate("Insufficient funds");
        } else {
            corp.unlock(data);
            corp.rerender();
        }
    }

    return (
        <div className={"cmpy-mgmt-upgrade-div tooltip"} style={{"width" : "45%"}} onClick={onClick}>
            {text}
            <span className={"tooltiptext"}>{tooltip}</span>
        </div>
    )
}
