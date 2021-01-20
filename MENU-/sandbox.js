const list=document.querySelector('ul');
const form=document.querySelector('form');

const addRecipe=(recipe,id)=>{
    let html=`
    <li data-id=${id}>
    <div>${recipe.title}</div>
    <div>${recipe.created_at.toDate()}</div>
    <button class="btn btn-danger btn-sm my-2">delete</button>
    </li>
    `;
    list.innerHTML+=html;
}

const deleteRecipe=(id)=>{
    const recipes=document.querySelectorAll('li');
    recipes.forEach(recipe=>{
        if(recipe.getAttribute('data-id')===id){
            recipe.remove();
        }
    });
}

/* db.collection('recipes').get().then((snapshot)=>{
    snapshot.docs.forEach(doc => {
        addRecipe(doc.data(),doc.id);
    });
}).catch(err=>{
    console.log(err);
}); */

db.collection('recipes').onSnapshot(snapshot=>{
    //console.log(snapshot.docChanges());
    snapshot.docChanges().forEach(change=> {
        const doc=change.doc;
        //console.log(doc);
        if(change.type==='added'){
            addRecipe(doc.data(),doc.id);
        }
        else if(change.type==='removed'){
            deleteRecipe(doc.id);
        }
    });
});

//add to document

form.addEventListener('submit',e=>{
    e.preventDefault();
    const now=new Date();
    const recipe={
        title: form.recipe.value,
        created_at: firebase.firestore.Timestamp.fromDate(now)
    };
    db.collection('recipes').add(recipe).then(()=>{
        console.log('recipe added');
    }).catch(err=>{
        console.log(err);
    })
})

//deleting data

list.addEventListener('click',e=>{
    console.log(e);
    if(e.target.tagName=='BUTTON')
    {
        const id=e.target.parentElement.getAttribute('data-id');
        //console.log(id);
        db.collection('recipes').doc(id).delete().then(()=>{    
            console.log('RECIPE DELETED');
        }).catch(err=>{
            console.log(err);
        });   
    }
});