class Acceptor extends Anchor{

    constructor(rect,type,relativePosition,accepts,order='DOWN'){
        super(rect,type,relativePosition);
        this.accepts = accepts;
        this.order = order;

        this.donors = [];
    }

    snapDonor(donor){
        if(this.donors.indexOf(donor)===-1){
            donor.acceptor = this;
            this.donors.push(donor);

            if(this.order==='UP'){
                //this.rect.svgElement.parentNode.insertBefore(donor.rect.svgElement,this.rect.svgElement);
                orderElements(this.rect.svgElement,donor.rect.svgElement);
            }else
            if(this.order==='DOWN'){
                //this.rect.svgElement.parentNode.insertAfter(donor.rect.svgElement,this.rect.svgElement);
                orderElements(this.rect.svgElement,donor.rect.svgElement);
                orderElements(donor.rect.svgElement,this.rect.svgElement);
            }

            


        }
    }

    get full(){
        if(this.accepts===-1){
            return false;
        }else{
            return (this.donors.length>=this.accepts);
        }
    }

    /*fullInsteadOf(donors){

    }*/

    isAccepting(donor){
        return this.type===donor.type;
    }

    get followingDonors(){
        return this.donors.filter((donor)=>donor.follow);
    }
}

function orderElements(first, second) {
    first.parentNode.insertBefore(second,first);
}