class RecintosZoo {
    constructor() {
        this.recintos = [
          { numero: 1, bioma: 'savana', tamanhoTotal: 10, animaisExistentes: [{ especie: 'MACACO', quantidade: 3 }] },
          { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animaisExistentes: [] },
          { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animaisExistentes: [{ especie: 'GAZELA', quantidade: 1 }] },
          { numero: 4, bioma: 'rio', tamanhoTotal: 8, animaisExistentes: [] },
          { numero: 5, bioma: 'savana', tamanhoTotal: 9, animaisExistentes: [{ especie: 'LEAO', quantidade: 1 }] }
        ];
    
        this.animais = {
          LEAO: { tamanho: 3, bioma: ['savana'], carnivoro: true },
          LEOPARDO: { tamanho: 2, bioma: ['savana'], carnivoro: true },
          CROCODILO: { tamanho: 3, bioma: ['rio'], carnivoro: true },
          MACACO: { tamanho: 1, bioma: ['savana', 'floresta'], carnivoro: false },
          GAZELA: { tamanho: 2, bioma: ['savana'], carnivoro: false },
          HIPOPOTAMO: { tamanho: 4, bioma: ['savana', 'rio'], carnivoro: false }
        };
      }
    

      analisaRecintos(animalEspecie, quantidade) {

// verifica se o animal recebido no parâmetro existe na lista de animais 
        const animal = this.animais[animalEspecie];
        if (!animal) return { erro: "Animal inválido" }; 
    
  // verifica se a quantidade digitada é menor ou igual a zero ou se o valor digitado é diferente de um numero inteiro 
        if (quantidade <= 0 || !Number.isInteger(quantidade)) return { erro: "Quantidade inválida" };  
    
        const recintosViaveis = [];
    

        for (const recinto of this.recintos) {
 
  //verifica se pelo menos um dos biomas no array está incluído na lista de biomas do animal        
          const biomasRecinto = recinto.bioma.split(" e ");
          if (!biomasRecinto.some(bioma => animal.bioma.includes(bioma))) continue;
    

          const animaisExistentes = recinto.animaisExistentes;
          if (!this.verificarCarnivoros(animaisExistentes, animal)) continue;
    

          if (!this.verificarHipopotamo(recinto, animal)) continue;
          if (!this.verificarMacaco(recinto, animal)) continue;
    
          
          const espacoDisponivel = this.calcularEspacoDisponivel(recinto, animal, quantidade);
          if (espacoDisponivel >= 0) {
            recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoDisponivel} total: ${recinto.tamanhoTotal})`);
          }
        }
    
        if (recintosViaveis.length === 0) return { erro: "Não há recinto viável" };
        return { recintosViaveis };
      }
//caso o animal seja carnivoro, verifica se o animal existente no recinto também é carnivoro     
      verificarCarnivoros(animaisExistentes, animal) {
        if (animal.carnivoro) {
          if (animaisExistentes.length > 0) {
              const primeiroAnimal = this.animais[animaisExistentes[0].especie];
//se o animal no recinto for herbívoro não permite adicionar o carnívoro              
              if (!primeiroAnimal.carnivoro) {
                  return false;
              }
          }
      } else {
        // Se o novo animal é herbívoro, verifique se já existem animais no recinto
          if (animaisExistentes.length > 0) {
             // Se já existem animais e o primeiro animal é carnívoro, não é permitido adicionar o herbívoro
              const primeiroAnimal = this.animais[animaisExistentes[0].especie];
              if (primeiroAnimal.carnivoro) {
                  return false;
              }
          }
      }
      //se nenhuma das condições de conflito for atendida permite a convivência dos animais
      return true;
      }
//faz a verificação do animal e caso seja hipopotamo ele só poderá ser incluso nos seguintes biomas (savana ou rio)    
      verificarHipopotamo(recinto, animal) {
      
        if (animal.especie === "HIPOPOTAMO") {
          return recinto.bioma.includes("savana") && recinto.bioma.includes("rio");
        }
        return true;
      }

//verifica se já existem macacos no recinto     
      verificarMacaco(recinto, animal) {
      
        if (animal.especie === "MACACO") {
          return recinto.animaisExistentes.length > 0;
        }
        return true;
      }
    
      calcularEspacoDisponivel(recinto, animal, quantidade) {

//calcula o tamanho e a quantidade dos animais no recinto      
        const espacoOcupado = recinto.animaisExistentes.reduce(
          (acc, a) => acc + (this.animais[a.especie].tamanho * a.quantidade || 0),
          0
      );

//verifica se a especie existente no recinto é diferente da que está sendo inserida      
        const especieDiferenteNoRecinto = recinto.animaisExistentes.some(a => this.animais[a.especie] != animal);
        
    
        let espacoDisponivel = recinto.tamanhoTotal - espacoOcupado;

//caso as especies sejam diferentes ele consome -1 no espaço disponivel         
        if (especieDiferenteNoRecinto) {
          espacoDisponivel -= 1; 
        }
//calcula o espaço necessario para os animais
        const espacoNecessario = animal.tamanho * quantidade;
    
        
        return espacoDisponivel - espacoNecessario;
    }

}

export { RecintosZoo as RecintosZoo };
