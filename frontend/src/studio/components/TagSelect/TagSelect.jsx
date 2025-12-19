

// ----css----
import TagSelectStyles from './TagSelect.module.css';




function TagSelect({tags, selectedTags, toggleTag}) {
    return (
        <div className={TagSelectStyles.tags}>
            <label>タグ</label>
            {tags.map((tag) => (
                <span
                    key={tag.id}
                    className={`${TagSelectStyles.tag} ${selectedTags.includes(tag.id) ? TagSelectStyles.activeTag : ""}`}
                    onClick={() => toggleTag(tag.id)}
                >
                    {tag.name}
                </span>
            ))}
        </div>
    );


}


export default TagSelect;
