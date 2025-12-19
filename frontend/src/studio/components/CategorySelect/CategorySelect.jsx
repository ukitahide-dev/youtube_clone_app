
// ----css----
import CategorySelectStyles from './CategorySelect.module.css';




// 親: UploadVideoForm.jsx
// 役割: カテゴリー一覧を表示する


function CategorySelect({ categories, selectedCategory, setSelectedCategory}) {


    return (
        <div className={CategorySelectStyles.categoryBox}>
            <label>カテゴリ</label>
            <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
            >
                <option value="">選択してください</option>

                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                        {cat.name}
                    </option>
                ))}
            </select>
        </div>
    );

}



export default CategorySelect;
