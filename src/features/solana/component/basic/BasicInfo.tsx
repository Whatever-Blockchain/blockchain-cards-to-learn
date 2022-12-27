import React from "react";
import Balance from "./cards/Balance";
import RentExempt from "./cards/RentExempt";
import AccountDetail from "./cards/AccountDetail";

function BasicInfo() {
  return (
    <div className="featured">
      <Balance />
      <RentExempt />
      <AccountDetail />
    </div>
  );
}

export default BasicInfo;
