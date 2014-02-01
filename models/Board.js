function board(){
    this.pieces = [
        function gandalf(){
            this.name = "Gandalf";
            },
        function Sauron(){
            this.name = "Sauron";
            }];
    this.squares = {
        mordor: function (){
            this.name = "mordor";
        },
        shire: function(){
            this.name = "The Shire";
        }
    };
    this.validMoves = [
        {from: this.squares.mordor, to: this.squares.shire }
        ];
    this.validRetreats = [
        {from: this.squares.shire, to: this.squares.mordor }
        ];
    }
