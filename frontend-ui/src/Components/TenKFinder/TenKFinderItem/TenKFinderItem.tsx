import React from "react";
import { Link } from "react-router-dom";
import { CompanyTenK } from "../../../company";

type Props = {
  tenK: CompanyTenK;
};

const TenKFinderItem = ({ tenK }: Props) => {
  const fillingDate = new Date(tenK.fillingDate).getFullYear();

  return (
    <Link
      reloadDocument
      to={tenK.finalLink}
      type="button"
      className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-blue-200 rounded-l-lg hover:bg-blue-200 hover:text-blue-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:text-blue-900"
      style={{ borderRadius: "0.5rem 0.5rem 0.5rem 0.5rem" }}

>
      10K - {tenK.symbol} - {fillingDate}
    </Link>
  );
};

export default TenKFinderItem;
