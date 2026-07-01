import Header from './Header';
import artikPhoto from '../photos/artik.jpg';
import paulPhoto from '../photos/paul 2.jpg';
import vechiPhoto from '../photos/vechi.jpg';


const authors = [
    {
        name: 'Мацеевский Артемий',
        nickname: 'artik',
        photo: artikPhoto
    },
    {  
        name: 'Ситников Павел',
        nickname: 'paul',
        photo: paulPhoto
    },
    {
        name: 'Пырегов Вячеслав',
        nickname: 'vechislav',
        photo: vechiPhoto
    }
];

function AuthorsPage() {
    return (
        <>
            <Header />
            <div style={{
                maxWidth: 1200,
                margin: '40px auto',
                padding: '0 20px'
            }}>
                <h1 style={{
                    textAlign: 'center',
                    color: '#3C3C3C',
                    fontSize: '36px',
                    marginBottom: '40px'
                }}>
                    Об авторах
                </h1>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '40px',
                    flexWrap: 'wrap'
                }}>
                    {authors.map((author, index) => (
                        <div key={index} style={{
                            background: '#E4E4E5',
                            borderRadius: '16px',
                            padding: '30px',
                            textAlign: 'center',
                            width: '250px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{
                                width: '150px',
                                height: '150px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                margin: '0 auto 20px',
                                border: '4px solid #949494'
                            }}>
                                <img
                                    src={author.photo}
                                    alt={author.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            </div>
                            <h2 style={{
                                color: '#3C3C3C',
                                fontSize: '20px',
                                marginBottom: '8px'
                            }}>
                                {author.name}
                            </h2>
                            <p style={{
                                color: '#7A7A7A',
                                fontSize: '16px',
                                fontStyle: 'italic'
                            }}>
                                @{author.nickname}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default AuthorsPage;