/*  COMP229-013 F2021
    Group Project Part 2 Final Release - Smart Survey
    File Name:   public/Scripts/app.js
    Student#:    301147411, 301182173, 301163120, 301168420, 301182196, 301159644 
    Name:        Marcus Ngooi, Tatsiana Ptushko, Josef Signo, Sukhmannat Singh, Yuko Yamano, Agustin Ignacio Zuluaga
    Description: Client-side script     
 */

"strict mode";

(function(){

    function Start()
    {
        console.log("App started...");

        let = deleteButtons = document.querySelectorAll('.btn-danger');

        for(button of deleteButtons)
        {
            button.addEventListener('click', (event) => {
                if(!confirm("Are you sure?"))
                {
                    event.preventDefault();
                    window.location.assign('/surveys');
                }
            });
        }
    }

    window.addEventListener("load", Start);
})();