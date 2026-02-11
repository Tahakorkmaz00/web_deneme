import { articles } from '../utils/dataStore';
import './Education.css';

export default function Education({ onNavigate, onBack }) {
    return (
        <section className="education-page">
            <div className="edu-container">
                <button className="back-btn" onClick={onBack}>
                    ← Ana Sayfa
                </button>

                <div className="edu-header">
                    <span className="edu-header-icon">📚</span>
                    <h1>Eğitim</h1>
                    <p>Gitar tekniklerini derinlemesine öğren ve topluluğa katıl</p>
                </div>

                <div className="articles-grid">
                    {articles.map((article) => (
                        <div
                            key={article.id}
                            className="article-card"
                            onClick={() => onNavigate('article', { articleId: article.id })}
                            style={{ '--card-accent': article.color }}
                        >
                            <div className="article-card-accent"></div>
                            <div className="article-card-body">
                                <div className="article-icon">{article.icon}</div>
                                <h2>{article.title}</h2>
                                <p>{article.shortDesc}</p>
                                <div className="article-read-more">
                                    <span>Makaleyi Oku</span>
                                    <span className="read-arrow">→</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="edu-info-banner">
                    <span className="info-icon">💡</span>
                    <p>Her makalenin altında topluluk yorumları bulunur. Ritim kalıbınızı paylaşarak sohbete katılın!</p>
                </div>
            </div>
        </section>
    );
}
