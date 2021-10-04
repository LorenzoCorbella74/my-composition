import "./styles.css";

/* 
  ESEMPIO di Object Composition
  SOURCE: https://alligator.io/js/class-composition/

  USAGE: uso di funzione che permette di comporre oggetti con proprietà, 
  metodi e getter/setter
  E' usata al posto di Object.assign per fare il merge di più oggetti (che non copia getter/setter)
  per sviluppare il COMPOSITION PATTERN
*/

const Component_Hp = (start) => {
  let self = {
    hp: 100 || start,
    // getter
    get alive() {
      return this.hp > 0;
    },
    /* get dead() {
      return this.hp <= 0;
    }, */
    // methods aka behaviours
    decreaseHp: function (howMuch) {
      this.hp -= howMuch;
    },
    increaseHp: function (howMuch) {
      this.hp += howMuch;
    }
  };

  console.log(self);
  return self;
};

// single behaviour
const canSayHi = (self) => ({
  sayHi: () => console.log(`Hi! I'm ${self.name}`)
});

const Component_Position = (x = 0, y = 0) => {
  let self = {
    x,
    y
  };
  return self;
};

function mergeComponent(start, ...objs) {
  // return Object.assign(start, ...objs); // Object.assign non copia i getter!!! ma solo il valore
  return myAssign(start, ...objs);
}

// Questa funzione copia mantenendo getter e setter
// SOURCE: https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
function myAssign(target, ...sources) {
  sources.forEach((source) => {
    Object.defineProperties(
      target,
      Object.keys(source).reduce((descriptors, key) => {
        descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
        return descriptors;
      }, {})
    );
  });
  return target;
}

let self = {
  name: "Lorenzo",
  age: 46
};

const lore = mergeComponent(
  self,
  Component_Hp(100),
  Component_Position(23, 56),
  canSayHi(self)
);

// si possono attaccare i getter/setter anche dopo
// la creazione dell'obj ma NON FUNZIONA !!!!
Object.defineProperty(lore, "dead", {
  get: function () {
    return this.hp <= 0;
  }
});

console.log(lore.alive, lore.dead); // esiste il getter
lore.decreaseHp(110);
console.log(lore.hp);
console.log(lore.alive, lore.dead);
lore.increaseHp(110);
console.log(lore.hp);
console.log(lore.alive);
lore.sayHi();

console.log(lore);

// JSON.stringify rimuove i metodi e calcola i getter
// da notare che non c'è il getter aggiunto in seguito

document.getElementById("app").innerHTML = `${JSON.stringify(lore, null, 4)}`;
