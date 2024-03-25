import React, { SyntheticEvent } from "react";
import CardPortfolio from "../CardPortfolio/CardPortfolio";
import { PortfolioGet } from "../../../Models/Portfolio";
import { FiAlertCircle } from "react-icons/fi";

interface Props {
  portfolioValues: PortfolioGet[];
  onPortfolioDelete: (e: SyntheticEvent) => void;
}

const ListPortfolio = ({ portfolioValues, onPortfolioDelete }: Props) => {
  return (
    <section className="bg-blue-200 py-10">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-5">
          My Portfolio
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {portfolioValues.length > 0 ? (
            portfolioValues.map((portfolioValue) => (
              <CardPortfolio
                key={portfolioValue.id}
                portfolioValue={portfolioValue}
                onPortfolioDelete={onPortfolioDelete}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center bg-blue-100 rounded-lg p-6">
              <FiAlertCircle className="text-4xl text-yellow-500 mb-4" />
              <h3 className="text-xl md:text-2xl font-semibold text-center">
                Your portfolio is empty.
              </h3>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ListPortfolio;
