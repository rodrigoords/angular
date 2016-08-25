angular.module("outline", ['ui.bootstrap']);

angular.module("outline")
    /***************************************************************************************
     * 
     * Controller para login.html 
     *  
     ***************************************************************************************/
    .controller("loginCtrl", function($scope) {

    })
    /***************************************************************************************
     * 
     * Controller para index.html 
     *  
     ***************************************************************************************/
    .controller("indexCtrl", function($scope, $uibModal) {

        $scope.animationsEnabled = true;

        $scope.openAboutModalIndex = function(size) {

            var _aboutModal = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'templates/about.html',
                controller: 'indexCtrl',
                size: size
            });
        };
    })

    /***************************************************************************************
     * 
     * Controller para financeiro.html 
     *  
     ***************************************************************************************/

    .controller("financeiroCtrl", function($scope, $uibModal) {
        $scope.app = "Controle Financeiro";
        $scope.lancamentosBanco = [
            { id: 1, data: "26/03/2016", descricao: "lanc 1", valor: 320 },
            { id: 2, data: "26/03/2016", descricao: "lanc 2", valor: 400 },
            { id: 3, data: "26/03/2016", descricao: "lanc 3", valor: 630 },
            { id: 4, data: "27/03/2016", descricao: "lanc 1", valor: 300 }
        ];
        $scope.animationsEnabled = true;
        $scope.lancamentos = [];

        /* 
        name...: formataData
        comment: Função local para padronizar a data.
        return.: Retorna a data no formato yyyy/mm/dd
         */
        $scope.formataData = function(data) {
            var dataRet = data.substring(6, 10) + "/" + data.substring(3, 5) + "/" + data.substring(0, 2);
            return dataRet;
        }


        for (index = 0; index < $scope.lancamentosBanco.length; index++) {


            var data = $scope.lancamentosBanco[index].data;
            var dataAtual = new Date();

            data = $scope.formataData(data);

            dataAtual = dataAtual.getFullYear() + "/" + (dataAtual.getMonth() + 1) + "/" + dataAtual.getDate();

            dataAtual = new Date(dataAtual);

            data = new Date(data);

            if (data.getTime() === dataAtual.getTime()) {
                $scope.lancamentos.push($scope.lancamentosBanco[index]);
            }
        }

        /* 
        name...: apagarLacamentos
        comment: Apaga do scopo os lançamentos que estejam selecionados e atuliza o scopo.
        return.: 
         */
        $scope.apagarLacamentos = function(lancamentos) {

            $scope.lancamentos = lancamentos.filter(function(lancamento) {
                if (!lancamento.selecionado) return lancamento;
            });
        }

        /*  
        name...: atualizaLancamentos
        comment: Atualiza o scopo de lançamentos de acordo com a data informada.
        return.: 
         */
        $scope.atualizaLancamentos = function(_lancamentos, _date) {
            var data;
            $scope.lancamentos = _lancamentos.filter(function(lancamento) {

                data = $scope.formataData(lancamento.data);
                data = new Date(data);
                if (data.getTime() === _date.getTime()) {

                    return lancamento;
                }
            });
        }
        
        /*
        name..: fStatusSelecao
        commet: Função para verificar se o campo está ou não selectionado.
        return:   
        */
        $scope.fStatusSelecao = function(lancamento){
            lancamento.selecionado = !lancamento.selecionado;
            return lancamento.selecionado;
        }
        /* 
        name...: hasLancamentoSelecionado
        comment: Verificar se existem lancamentos selecionados no momento.
        return.: Retorna true caso exista pelo menos um lançamento selecionado.
         */
        $scope.hasLancamentoSelecionado = function(lancamentos) {
            return lancamentos.some(function(lacamento) {
                return lacamento.selecionado;
            });
        }

        /* 
        name...: hasUmLancamentoSelecionado
        comment: Verificar se existe somente um lancamento selecionado no momento.
        return.: Retorna true caso exista apenas um lançamento selecionado.
         */
        $scope.hasUmLancamentoSelecionado = function() {
            var _ret = false;

            var _lancamentos = $scope.lancamentos.filter(function(lancamento) {
                if (lancamento.selecionado) return lancamento;
            });

            if (_lancamentos.length === 1) _ret = true;

            return _ret;
        }

        /* 
        name...: valorTotal
        comment: Calcula  valor total dos lançamentos no scopo.
        return.: retorna a soma de todos os lançamentos no scopo.
         */
        $scope.valorTotal = function(lancamentos) {

            var valorTotal = 0;

            for (index = 0; index < lancamentos.length; index++) {

                valorTotal += lancamentos[index].valor;
            }

            return valorTotal;
        }

        /* 
        name...: openAboutModal
        comment: Modal responsavel por mostrar a tela about
                 parametro size pode receber sm (small) e lg (large) 
        return.: 
        */
        $scope.openAboutModal = function(size) {

            var _aboutModal = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'templates/about.html',
                controller: 'financeiroCtrl',
                size: size
            });
        };

        /* 
        name...: OpenCadastroModal
        comment: Modal responsavel por mostrar a tela de cadastro de lancamentos financeiros
                 parametro size pode receber sm (small) e lg (large) 
        return.: 
        */
        $scope.OpenCadastroModal = function(size) {

            var _cadastroModal = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'templates/cadastroLancamento.html',
                controller: 'cadastroLancamentoModalCtrl',
                size: size
            });
            /*Após o modal ser fechado verifica o seu retorno, caso seja um lacamento realiza a persistencia dele*/
            _cadastroModal.result.then(function(lancamento) {
                if (lancamento != 'close') {
                    console.log(lancamento);
                    $scope.lancamentosBanco.push(angular.copy(lancamento));
                    $scope.atualizaLancamentos($scope.lancamentosBanco, new Date($scope.formataData(lancamento.data)));
                    delete $scope.lancamento;
                }

            });
        };
        /* 
        name...: toggleAnimation
        comment: função que controla a variavel que seta a animação do modal.
        return.: 
         */
        $scope.toggleAnimation = function() {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };
        /* 
        name...: 
        comment: Trecho responsavel por gerenciar os processos do calendario de busca..
        return.: 
         */
        $(document).ready(function() {
            
               
            $('.responsive-calendar').responsiveCalendar({
                
                translateMonths: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
                onDayClick: function(events) {

                    _date = $(this).data('year') + '/' + $(this).data('month') + '/' + $(this).data('day');

                    $scope.atualizaLancamentos($scope.lancamentosBanco, new Date(_date));

                    $scope.$apply();

                    $("#calendarModal").modal('toggle');

                }                

            });
        });
    })
    /***************************************************************************************
     * 
     * Controller para cadastroLancamento.html 
     *  
     ***************************************************************************************/
    .controller('cadastroLancamentoModalCtrl', function($scope, $uibModalInstance) {
        /* 
        name...: salvarLancamento
        comment: Salva o lancamento informado no scopo principal e atualiza os lançamentos.
        return.: 
        */

        $scope.salvarLancamento = function(lancamento) {

            $uibModalInstance.close(lancamento);

        }

        $scope.cancel = function() {
            $uibModalInstance.close("close");
        };
    });