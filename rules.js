let inventory = new Set();
class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); //1 TODO: replace this text using this.engine.storyData to find the story title
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); //1 TODO: replace this text by the initial location of the story
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key]; //1TODO: use `key` to get the data object for the current story location
        this.engine.show(locationData.Body); // TODO: replace this text by the Body of the location data
        
        if(locationData.Choices) {
            for(let choice of locationData.Choices) {
                if (choice.Special) {
                    this.engine.addSpecial(choice.Special, choice);
                }else{
                    this.engine.addChoice(choice.Text, choice);
                }
                
            }
        } else {
            this.engine.addChoice("The end.")
        }
    }

    handleChoice(choice) {
        if(choice) {
            if (choice.Target=="Try again") {
                window.location.reload();
            }
            this.engine.show("&gt; "+choice.Text);
            //pickup item and add to your inventory
            if (choice.Pickup) {
                inventory.add(choice.Pickup);
            }
            //if you dont have a needed item you die
            if (choice.Need && !inventory.has(choice.Need)) {
                if (choice.Target=="Main") {
                    this.engine.gotoScene(Location, "Sucked");
                } else if (choice.Target=="Beyond"){
                    this.engine.gotoScene(Location, "Locked");
                }else {
                    this.engine.gotoScene(Location, "Death");
                }
                
            }else{
                this.engine.gotoScene(Location, choice.Target);
            }
            
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');