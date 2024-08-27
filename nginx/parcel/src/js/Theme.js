const Theme = {
    bgcolor: 'black',
    scorecolor: 'yellow',
    ballcolor: 'blue',
};

Theme.set = name => {
    if (name == 'space'){
        Theme.bgcolor = 'black',
        Theme.scorecolor = 'yellow',
        Theme.ballcolor = 'blue';        
    }
    else if (name == 'prussian'){
        Theme.bgcolor = 'orange',
        Theme.scorecolor = 'mustard',
        Theme.ballcolor = 'yellow';        
    }
    else if (name == 'cursed'){
        Theme.bgcolor = 'green',
        Theme.scorecolor = 'orange',
        Theme.ballcolor = 'gold';        
    }
};

export default Theme;