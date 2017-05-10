require 'test_helper'

class WelcomeControllerTest < ActionDispatch::IntegrationTest
  test "should get dashboard" do
    get welcome_dashboard_url
    assert_response :success
  end

  test "should get query" do
    get welcome_query_url
    assert_response :success
  end

  test "should get question" do
    get welcome_question_url
    assert_response :success
  end

  test "should get map" do
    get welcome_map_url
    assert_response :success
  end

end
