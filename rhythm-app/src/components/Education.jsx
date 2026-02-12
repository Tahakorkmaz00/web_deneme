import { getAllArticles } from '../utils/dataStore';
import './Education.css';

export default function Education({ onNavigate, onBack }) {
    const allArticles = getAllArticles();

    return (
        <section className="education-page">
            <div className="edu-container">

                <div className="edu-header">
                    <span className="edu-header-icon">📚</span>
                    <h1>Forum</h1>
                    <p>Gitar tekniklerini derinlemesine öğren ve topluluğa katıl</p>
                </div>

                <div className="edu-actions">
                    <button
                        className="add-article-btn"
                        onClick={() => onNavigate('create-article')}
                    >
                        ✏️ Makale Ekle
                    </button>
                </div>

                <div className="articles-grid">
                    {allArticles.map((article, idx) => (
                        <div
                            key={article.id}
                            className="article-card"
                            onClick={() => onNavigate('article-view', { articleId: article.id })}
                            style={{ '--card-accent': article.color, '--article-i': idx }}
                        >
                            <div className="article-card-accent"></div>
                            <div className="article-card-body">
                                <div className="article-icon">{article.icon}</div>
                                <h2>{article.title}</h2>
                                <p>{article.shortDesc}</p>
                                {article.isUserCreated && (
                                    <div className="article-author-tag">
                                        <span>👤 {article.author || 'Anonim'}</span>
                                    </div>
                                )}
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
