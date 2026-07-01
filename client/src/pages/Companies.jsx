import React from 'react';
import './Companies.css';

function Companies() {
  return (
    <section className="companies">
      <div className="companies_container">
        <ul className="companies_list">
          <li className="companies_company">
            <a href="/authors" className="inform">Дополнительная информация</a>
          </li>
          <li className="companies_company">
            <a href="/" className="inform">Ссылки</a>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default Companies;