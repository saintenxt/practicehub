import tgIcon from '../photos/tg.png';

const Companies = () => {
  return (
    <section className="companies">
      <div className="companies_container">
        <ul className="companies_list">
          <li className="companies_company">
            <a href="/authors" className="inform">Дополнительная информация</a>
          </li>
          <li className="companies_company">
            <a
              href="https://t.me/practice_hub"
              target="_blank"
              rel="noopener noreferrer"
              className="inform"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <img
                src={tgIcon}
                alt="Telegram"
                style={{
                  width: '24px',
                  height: '24px',
                  objectFit: 'contain'
                }}
              />
              Telegram
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Companies;