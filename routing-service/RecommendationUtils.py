import os
from google.cloud import language_v1
import tweepy

import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from scipy import sparse
import argparse
import json
import os
from google.cloud import language_v1
import tweepy

# Replace "/User/your-service-account-key.json" with the actual path to your service account key JSON file
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/Users/premselvaraj29/Downloads/booming-quasar-403101-f0e90b69429c.json"

def content(contentc):
    list_of_categories=[]
    client = language_v1.LanguageServiceClient()

    text_content = contentc
    type_ = language_v1.Document.Type.PLAIN_TEXT
    language = "en"
    document = {"content": text_content, "type_": type_, "language": language}
    encoding_type = language_v1.EncodingType.UTF8

    content_categories_version = (
        language_v1.ClassificationModelOptions.V2Model.ContentCategoriesVersion.V2)

    # Analyze sentiment
    response1 = client.analyze_sentiment(
        request={"document": document, "encoding_type": encoding_type}
    )

    # Analyze content categories
    response2 = client.classify_text(
        request={
            "document": document,
            "classification_model_options": {
                "v2_model": {"content_categories_version": content_categories_version}
            }
        }
    )

    a = set()

    for sentence in response1.sentences:
        if sentence.sentiment.score > 0.2:
            for category in response2.categories:
                if category.confidence > 0.2:
                    category_name = category.name
                    list_of_categories.append(category_name)
                    
    
    return list_of_categories

# Get your Twitter API credentials and enter them here
consumer_key = "NxDyN9wjMoEotCsu0kvaGM6Qv" # Add your API key here
consumer_secret = "hq61mYCUmjZjdj7B79VdO9qLzfNX3yAbB80Upau7clDvcXqnJz" # Add your API secret key here
access_key = "2213402124-mc6x9mhfO15O7llaKBSgcxEvChmgafA7hKMBXFQ" 
access_secret = "9m012BL9k7rWkKwAfkII3YlBML0SVijCfxZUHe2gu1W7A"
bearer_token = "AAAAAAAAAAAAAAAAAAAAACFOsQEAAAAAEQUAfEmQTSOFV75DtYLWhtz1L6I%3DbAoXPA9C4cow1qYoGoqG0o0WxapA8ZRO5QBcsK2l63j5EXO6sc"


def get_user_id(username):
    # Tokens
    api = tweepy.Client(
        bearer_token=bearer_token,
        consumer_key=consumer_key,
        consumer_secret=consumer_secret,
        access_token=access_key,
        access_token_secret=access_secret
    )

    user = api.get_user(username=username)
    user_id = user.data.id
    return user_id

def get_user_tweets_analyzed(username):
    # Tokens
    api = tweepy.Client(
        bearer_token=bearer_token,
        consumer_key=consumer_key,
        consumer_secret=consumer_secret,
        access_token=access_key,
        access_token_secret=access_secret
    )

    user = api.get_user(username=username)
    user_id = user.data.id

    tweets = api.get_users_tweets(id=user_id, max_results=5)  #Getting the tweets of the user
#    MAKE IT RETURN {
#   score: 0.5,magnitude: 0.5, categories: [{name:'Photo & Video Sharing',confidence:0.8}, {name:'Photo & Video Sharing',confidence:0.8}]}

    all_categories = get_categories_for_tweets(tweets) #Getting all the categories of the tweets
    list_of_tuple_username_categories = [(username, i) for i in all_categories]
    return list_of_tuple_username_categories
    print("Username")
   
    
def deep_flatten(lst):
    flattened_list = []
    for i in lst:
        if isinstance(i, list):
            flattened_list.extend(deep_flatten(i))
        else:
            flattened_list.append(i)
    return flattened_list

def get_categories_for_tweets(tweets):
    total_categories =[]
    for i in range(len(tweets.data)):
         tweet_content = tweets.data[i].text
         categories = content(tweet_content)
         total_categories.append(categories)
    return deep_flatten(total_categories)

        
def get_main_user_tweets(username):
    # Tokens
    global_result = []
    main_user_result = get_user_tweets_analyzed(username)
    #print("Main user result ")
    global_result.append(main_user_result)
    #print(main_user_result)
        
    liked_tweets_result=get_liked_tweets_for(username)
    global_result.append(liked_tweets_result)
    return deep_flatten(global_result)

def get_liked_tweets_for(username):
    function_result=[]
    api = tweepy.Client(
    bearer_token=bearer_token,
    consumer_key=consumer_key,
    consumer_secret=consumer_secret,
    access_token=access_key,
    access_token_secret=access_secret)    
    user= api.get_user(username=username)
    #print(user)    
    user_id= user.data.id
    #print(user[0])
    response = api.get_liked_tweets(id=user_id, expansions='author_id',max_results=5)
    print(response.includes)
    for i in range(len(response.includes["users"])):
        print(response.includes["users"][i].username)
        liked_user_result=get_user_tweets_analyzed(response.includes["users"][i].username)
        print("Liked user result ",response.includes["users"][i].username)
        function_result.append(liked_user_result)
        print(liked_user_result)
    return function_result

# print("Enter one username")
# user = input("Enter username:")
# df_input= get_main_user_tweets(user)

# print("******************")
# print(df_input)


import pandas as pd
def create_dataframe(df_input):
    # Process the categories to extract the first part and tally counts
    processed_data = []
    for user, category in df_input:
    # Extract the main category
        main_category = category.split('/')[1]  # Split by '/' and take the second element
        processed_data.append((user, main_category))

# Convert processed data into a DataFrame
    df_processed = pd.DataFrame(processed_data, columns=['User', 'Category'])

# Create a pivot table with users as rows, categories as columns, and counts as values
    pivot_df = pd.pivot_table(df_processed, index='User', columns='Category', aggfunc=len, fill_value=0)
    return pivot_df





def create_recommendation(df,username):
    # Convert the DataFrame into a sparse matrix for efficiency
    sparse_df = sparse.csr_matrix(df.values)

    # Calculate the cosine similarity matrix
    cosine_sim = cosine_similarity(sparse_df, dense_output=False)

    # Convert the cosine similarity matrix to a DataFrame for easier manipulation
    cosine_sim_df = pd.DataFrame(cosine_sim.toarray(), index=df.index, columns=df.index)

    # Get the similarity values for the first user (Alice) with all users
    similarity_scores = cosine_sim_df.iloc[0]

    # Sort the users based on similarity scores, excluding the first user herself
    sorted_users = similarity_scores.sort_values(ascending=False)[1:]

    # Identify the top N similar users for recommendations
    top_n_users = sorted_users.head(3).index

    # Compile recommendations from top N similar users
    recommendations = pd.Series(dtype='float64')
    for user in top_n_users:
        # Get categories that the first user hasn't interacted with yet (rated 0)
        unseen_categories = df.loc[username][df.loc[username] == 0].index
        # Add the unseen categories rated by the similar user to the recommendations
        recommendations=pd.concat([recommendations, df.loc[user, unseen_categories]])
        #recommendations = recommendations.append(df.loc[user, unseen_categories])

    # Group recommendations by category and calculate the average rating from the top N users
    recommendations = recommendations.groupby(recommendations.index).mean().sort_values(ascending=False)
    print(f"Recommended categories for CapstoneP003 based on top similar users' preferences: {recommendations.index.tolist()}")
    return recommendations
    
