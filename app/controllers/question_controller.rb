class QuestionController < ApplicationController

  def initialize
    @queryWizard = ::QueryWizard.new
    @parametricQuestion = ::ParametricQuestion.new @queryWizard
  end

  def create
    @question = Question.new @parametricQuestion.generate(params[:question])
    respond_to do |format|
      if @question.save
        format.html { redirect_to welcome_question_path }
        format.json { redirect_to welcome_question_path }
      end
    end
  end

  def delete
    @question = Question.find(params[:id])
    @question.destroy
    redirect_to welcome_question_path
  end

  def show
    html = @parametricQuestion.htmlCode Question.find(params[:id])
    respond_to do |format|
      format.json { render json: [ html ] }
    end
  end

  private
    def question_params
      params.require(:question).permit(:name, :source, :question, :query)
    end
end
